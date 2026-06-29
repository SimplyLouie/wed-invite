function doPost(e) {
  var lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var rsvpSheet = spreadsheet.getSheetByName("RSVP");
    var seatingSheet = spreadsheet.getSheetByName("(MasterGuestList)Seating");

    var data = JSON.parse(e.postData.contents);

    var timestamp = new Date();
    var name = String(data.name || "").trim();
    var email = String(data.email || "").trim();
    var attendance = String(data.attendance || "").trim();
    var message = String(data.message || "").trim();

    // EMAIL NOTIFICATION RECIPIENTS
    var notifyEmails = [
      "jmdonnu@gmail.com",
      "delacruzchezza@gmail.com"
    ];

    // FIND GUEST IN SEATING TAB
    var seatingData =
      seatingSheet
        .getDataRange()
        .getValues();

    var guestRow = null;
    var guestRowIndex = -1;
    var guestCount = 1;

    for (var i = 1; i < seatingData.length; i++) {

      var fullName =
        String(seatingData[i][0] || "")
          .trim();

      if (
        fullName.toLowerCase() ===
        name.toLowerCase()
      ) {

        guestRow = seatingData[i];
        guestRowIndex = i + 1;
        guestCount =
          seatingData[i][1] || 1;

        break;
      }
    }

    // UPDATE ATTENDANCE IN SEATING TAB
    if (guestRowIndex !== -1) {
      seatingSheet
        .getRange(
          guestRowIndex,
          4
        )
        .setValue(attendance);
    }

    // GUEST NOT FOUND
    if (!guestRow) {
      return ContentService
        .createTextOutput(JSON.stringify({
          result: "error",
          error: "Guest not found."
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // CHECK IF ALREADY RSVP'D
    var rsvpData = rsvpSheet.getDataRange().getValues();

    var existingRow = -1;

    for (var j = 1; j < rsvpData.length; j++) {
      var existingName = String(rsvpData[j][1]).trim();

      if (existingName.toLowerCase() === name.toLowerCase()) {
        existingRow = j + 1;
        break;
      }
    }

    // RSVP LOGIC (1 CONFIRM + 1 UPDATE ONLY)
    var submissionType = "";

    // Column G = Update Count
    var updateCountCol = 7;

    if (existingRow !== -1) {

      var currentUpdateCount =
        Number(
          rsvpSheet
            .getRange(existingRow, updateCountCol)
            .getValue()
        ) || 0;

      // LOCK after one update
      if (currentUpdateCount >= 1) {

        var savedData = rsvpSheet
          .getRange(existingRow, 1, 1, 7)
          .getValues()[0];

        return ContentService
          .createTextOutput(JSON.stringify({
            result: "locked",
            guest: {
              name: savedData[1],
              email: savedData[2],
              attendance: savedData[3],
              guestCount: savedData[4],
              message: savedData[5]
            }
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      // ALLOW ONE UPDATE
      submissionType = "Updated RSVP";

      rsvpSheet.getRange(existingRow, 1, 1, 6).setValues([[
        timestamp,
        name,
        email,
        attendance,
        guestCount,
        message
      ]]);

      // mark update used
      rsvpSheet
        .getRange(existingRow, updateCountCol)
        .setValue(1);

    } else {

      // FIRST RSVP
      submissionType = "New RSVP";

      rsvpSheet.appendRow([
        timestamp,
        name,
        email,
        attendance,
        guestCount,
        message,
        0 // update count
      ]);
    }

    /* EMAIL NOTIFICATION */
    var subject = "💍 Wedding RSVP Notification";

    var formattedDate = Utilities.formatDate(
      timestamp,
      Session.getScriptTimeZone(),
      "MMMM dd, yyyy • hh:mm a"
    );

    var emailBody =
      "💍 WEDDING RSVP NOTIFICATION\n" +
      "━━━━━━━━━━━━━━━━━━\n\n" +

      "📌 Status\n" +
      submissionType + "\n\n" +

      "👤 Guest\n" +
      name + "\n\n" +

      (attendance === "Accept"
        ? "✅ Attendance\nAccept\n\n"
        : "❌ Attendance\nDecline\n\n") +

      "👥 Allowed Guests\n" +
      guestCount + "\n\n" +

      "📧 Email\n" +
      email + "\n\n" +

      "💌 Message\n" +
      (message || "No message provided") + "\n\n" +

      "🕒 Submitted\n" +
      formattedDate;

    MailApp.sendEmail(
      notifyEmails.join(","),
      subject,
      emailBody
    );

    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        submissionType: submissionType
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "error",
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var action = String(e.parameter.action || "");
  var query = String(e.parameter.q || "")
    .toLowerCase()
    .trim();

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var seatingSheet = spreadsheet.getSheetByName("(MasterGuestList)Seating");
  var rsvpSheet = spreadsheet.getSheetByName("RSVP");

  // FIND SEAT (Accept only)
  if (action === "findSeat") {

    var data = seatingSheet
      .getDataRange()
      .getValues();

    var results = [];

    for (var j = 1; j < data.length; j++) {

      var fullName =
        String(data[j][0] || "")
          .trim();

      var guestCount =
        data[j][1] || 1;

      var table =
        String(data[j][2] || "")
          .trim();

      var attendance =
        String(data[j][3] || "")
          .trim()
          .toLowerCase();

      // Accept only
      if (attendance !== "accept") {
        continue;
      }

      // Search match
      if (
        fullName
          .toLowerCase()
          .includes(query)
      ) {
        results.push({
          fullName: fullName,
          guestCount: guestCount,
          table: table
        });
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        guests: results
      }))
      .setMimeType(
        ContentService.MimeType.JSON
      );
  }

  // HOST VIEWER (Accept only)
  if (action === "allGuests") {

    var data = seatingSheet
      .getDataRange()
      .getValues();

    var results = [];

    for (var j = 1; j < data.length; j++) {

      var fullName =
        String(data[j][0] || "")
          .trim();

      var table =
        String(data[j][2] || "")
          .trim();

      var attendance =
        String(data[j][3] || "")
          .trim()
          .toLowerCase();

      // Accept only
      if (attendance !== "accept") {
        continue;
      }

      results.push({
        fullName: fullName,
        table: table || "TBA"
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        guests: results
      }))
      .setMimeType(
        ContentService.MimeType.JSON
      );
  }

  // CHECK IF GUEST IS FINALIZED
  if (action === "checkGuest") {

    var rsvpData = rsvpSheet
      .getDataRange()
      .getValues();

    for (var i = 1; i < rsvpData.length; i++) {

      var guestName =
        String(rsvpData[i][1] || "")
          .trim()
          .toLowerCase();

      var updateCount =
        Number(rsvpData[i][6]) || 0;

      if (guestName === query) {

        var guestData = {
          name: rsvpData[i][1],
          email: rsvpData[i][2],
          attendance: rsvpData[i][3],
          guestCount: rsvpData[i][4],
          message: rsvpData[i][5]
        };

        // LOCKED / FINALIZED RSVP
        if (updateCount >= 1) {
          return ContentService
            .createTextOutput(JSON.stringify({
              locked: true,
              hasRSVP: true,
              guest: guestData
            }))
            .setMimeType(
              ContentService.MimeType.JSON
            );
        }

        // RSVP EXISTS BUT STILL EDITABLE
        return ContentService
          .createTextOutput(JSON.stringify({
            locked: false,
            hasRSVP: true,
            guest: guestData
          }))
          .setMimeType(
            ContentService.MimeType.JSON
          );
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        locked: false
      }))
      .setMimeType(
        ContentService.MimeType.JSON
      );
  }

  // NORMAL SEARCH
  var data = seatingSheet
    .getDataRange()
    .getValues();

  var results = [];

  for (var j = 1; j < data.length; j++) {

    var fullName =
      String(data[j][0] || "")
        .trim();

    var guestCount =
      data[j][1] || 1;

    if (
      fullName
        .toLowerCase()
        .includes(query)
    ) {
      results.push({
        fullName: fullName,
        guestCount: guestCount
      });
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({
      guests: results
    }))
    .setMimeType(
      ContentService.MimeType.JSON
    );
}
