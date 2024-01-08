'use strict';

import * as functions from 'firebase-functions';
import { google } from 'googleapis';
import admin from 'firebase-admin';
import { mapOrderToSpreadsheetLines } from './fields.js';

const SERVICE_ACCOUNT_KEYS = functions.config().googleapi.service_account;
const CONFIG_SHEET_ID = functions.config().googleapi.sheet_id;
const CONFIG_DATA_PATH = '/orders';

admin.initializeApp();
const client = new google.auth.JWT(SERVICE_ACCOUNT_KEYS.client_email, null, SERVICE_ACCOUNT_KEYS.private_key, ['https://www.googleapis.com/auth/spreadsheets']);

// trigger function to write to Sheet when new data comes in on CONFIG_DATA_PATH
export const appendrecordtospreadsheet = functions.database.ref(`${CONFIG_DATA_PATH}/{ITEM}`).onCreate(
  (snap) => {
    const newRecord = snap.val();
    const orders = mapOrderToSpreadsheetLines(newRecord);
    const promises = orders.map((orderLine) => {
      return appendPromise({
        spreadsheetId: CONFIG_SHEET_ID,
        range: 'A:X',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [orderLine]
        }
      });
    });
    return Promise.all(promises);
  });

// accepts an append request, returns a Promise to append it, enriching it with auth
function appendPromise(requestWithoutAuth) {
  return new Promise(async (resolve, reject) => {
    try {
      await client.authorize();
      const sheets = google.sheets({ version: 'v4', auth: client });
      const request = { ...requestWithoutAuth, auth: client };
      sheets.spreadsheets.values.append(request, (err, response) => {
        if (err) {
          functions.logger.log(`The API returned an error: ${err}`);
          return reject(err);
        }
        return resolve(response.data);
      });
    } catch (err) {
      functions.logger.log(`The API returned an error: ${err}`);
      return reject(err);
    }
  });
}
