import * as Realm from "realm-web";

const REALM_APP_ID = "phsmain-myacz";
// Deployment: phsmain-myacz
// Development: application-0-rzpjv

const app = new Realm.App({ id: REALM_APP_ID });

export default app;


// exports = async function(loginPayload) {
//     // General auth function on login page / sharer page / chat page
//
//
//     // Get a handle for the app.users collection
//     const users = context.services
//         .get("mongodb-atlas")
//         .db("sage_production")
//         .collection("all_profiles");
//     // Parse out custom data from the FunctionCredential
//     const username  = loginPayload.username;
//     const otp = loginPayload.OTP;
//     // Query for an existing user document with the specified username
//     const user = await users.findOne({ chat_id:username});
//     if (user) {
//         if (user.OTP === otp) {
//             return {"id":user.chat_id.toString(), "name" : user.chat_id.toString() }
//         } else {
//             throw "error";
//         }
//         // if ("000000" === otp) {
//         //   return {"id":user.chat_id, "name" : user.chat_id}
//         // } else {
//         //   throw "error";
//         // }
//
//     } else {
//         throw "error";
//     }
// };

