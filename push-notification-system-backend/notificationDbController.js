import mongoose from 'mongoose'
import NotificationModel from './models/notification.model.js';

async function updateStatusField(id, newValue) {
  try {
    const doc = await NotificationModel.findById(id); // step 1: get the document

    if (!doc) {
      console.log('Document not found!');
      return;
    }

    doc.status = newValue; // step 2: edit the field you want

    await doc.save(); // step 3: save it back to the database

    console.log('Document updated:', doc);
  } catch (error) {
    console.error('Error updating document:', error);
  }
}


async function updateSentCount(id , count){
  try {
    const doc = await NotificationModel.findById(id); // step 1: get the document

    if (!doc) {
      console.log('Document not found!');
      return;
    }

    doc.sent_count = count; // step 2: edit the field you want

    await doc.save(); // step 3: save it back to the database

    console.log('Document count updated:', doc);
  } catch (error) {
    console.error('Error updating document count:', error);
  }

}

export {updateStatusField,updateSentCount}