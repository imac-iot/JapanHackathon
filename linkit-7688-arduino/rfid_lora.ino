#include <SPI.h>
#include <PN532_SPI.h>
#include "PN532.h"
#include "TLM926P01A.h"
#include <SoftwareSerial.h>

PN532_SPI pn532spi(SPI, 10);
PN532 nfc(pn532spi);
String NewMes;
String OldMes;

void setup(void) {
  tlm_init();
  Serial.println("Hello!");

  nfc.begin();

  uint32_t versiondata = nfc.getFirmwareVersion();
  if (! versiondata) {
    Serial.print("Didn't find PN53x board");
    while (1); // halt
  }
  
  // Got ok data, print it out!
  /*
  Serial.print("Found chip PN5"); 
  Serial.println((versiondata>>24) & 0xFF, HEX); 
  Serial.print("Firmware ver. "); 
  Serial.print((versiondata>>16) & 0xFF, DEC); 
  Serial.print('.'); Serial.println((versiondata>>8) & 0xFF, DEC);
  */
  nfc.setPassiveActivationRetries(0xFF);
  
  // configure board to read RFID tags
  nfc.SAMConfig();
    
  Serial.println("Waiting for an ISO14443A card");
}

void loop(void) {
  boolean success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer to store the returned UID
  uint8_t uidLength;                        // Length of the UID (4 or 7 bytes depending on ISO14443A card type)
  char *cUid = "00000000";
  int data = 0;
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, &uid[0], &uidLength);
  
  if (success) {
    /*
    Serial.println("Found a card!");
    Serial.print("UID Length: ");
    Serial.print(uidLength, DEC);
    Serial.println(" bytes");
    Serial.print("UID Value: ");
    */
    for (uint8_t i=0; i < uidLength; i++) 
    {
      //Serial.print(" 0x");Serial.print(uid[i], HEX); 
      NewMes = NewMes + String(uid[i],HEX);
    }
    //Serial.println("");
    if(OldMes != NewMes)
    {
      OldMes = NewMes;
      NewMes.toCharArray(cUid, uidLength*2);
    //lora
      //Serial.print("lora ");
      //Serial.println(cUid);
      data = tlm_sent_data( cUid , uidLength*2) ;
      testprint( data );
      //Serial.println("");
    }
    //Serial.println("New: " + NewMes );
    //Serial.println("Old: " + OldMes );
    NewMes = "";
    // wait until the card is taken away
    //while (nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, &uid[0], &uidLength)) {}
  }
  
}
