import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({ region: 'us-east-1' })
const docClient = DynamoDBDocumentClient.from(client)

const bulbData = [
  // Toyota
  { make: 'Toyota', model: 'Corolla', headlightLow: 'H11', headlightHigh: 'H9', fogLight: 'H8', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Toyota', model: 'Camry', headlightLow: 'H11', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Toyota', model: 'RAV4', headlightLow: 'H11', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Toyota', model: 'Hilux', headlightLow: 'H11', headlightHigh: 'H9', fogLight: 'H16', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Toyota', model: 'Land Cruiser', headlightLow: 'D4S', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Toyota', model: 'Prado', headlightLow: 'H11', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  
  // Nissan
  { make: 'Nissan', model: 'Altima', headlightLow: 'H11', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Nissan', model: 'Sentra', headlightLow: 'H11', headlightHigh: 'H9', fogLight: 'H8', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Nissan', model: 'X-Trail', headlightLow: 'H11', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Nissan', model: 'Patrol', headlightLow: 'D2S', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Nissan', model: 'Navara', headlightLow: 'H11', headlightHigh: 'H9', fogLight: 'H16', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  
  // Honda
  { make: 'Honda', model: 'Civic', headlightLow: 'H11', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Honda', model: 'Accord', headlightLow: 'H11', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Honda', model: 'CR-V', headlightLow: 'H11', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Honda', model: 'Fit', headlightLow: 'H11', headlightHigh: 'H9', fogLight: 'H8', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  
  // Mazda
  { make: 'Mazda', model: 'Mazda3', headlightLow: 'H11', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Mazda', model: 'Mazda6', headlightLow: 'H11', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Mazda', model: 'CX-5', headlightLow: 'H11', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Mazda', model: 'CX-9', headlightLow: 'H11', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  
  // Subaru
  { make: 'Subaru', model: 'Impreza', headlightLow: 'H11', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Subaru', model: 'Forester', headlightLow: 'H11', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Subaru', model: 'Outback', headlightLow: 'H11', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Subaru', model: 'Legacy', headlightLow: 'H11', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  
  // Mitsubishi
  { make: 'Mitsubishi', model: 'Lancer', headlightLow: 'H11', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Mitsubishi', model: 'Outlander', headlightLow: 'H11', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Mitsubishi', model: 'Pajero', headlightLow: 'H11', headlightHigh: 'HB3', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Mitsubishi', model: 'L200', headlightLow: 'H11', headlightHigh: 'H9', fogLight: 'H16', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  
  // Mercedes
  { make: 'Mercedes', model: 'C-Class', headlightLow: 'D3S', headlightHigh: 'H7', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Mercedes', model: 'E-Class', headlightLow: 'D3S', headlightHigh: 'H7', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Mercedes', model: 'GLE', headlightLow: 'D3S', headlightHigh: 'H7', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Mercedes', model: 'GLC', headlightLow: 'D3S', headlightHigh: 'H7', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  
  // BMW
  { make: 'BMW', model: '3 Series', headlightLow: 'D3S', headlightHigh: 'H7', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'BMW', model: '5 Series', headlightLow: 'D3S', headlightHigh: 'H7', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'BMW', model: 'X3', headlightLow: 'D3S', headlightHigh: 'H7', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'BMW', model: 'X5', headlightLow: 'D3S', headlightHigh: 'H7', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  
  // Audi
  { make: 'Audi', model: 'A4', headlightLow: 'D3S', headlightHigh: 'H7', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Audi', model: 'A6', headlightLow: 'D3S', headlightHigh: 'H7', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Audi', model: 'Q5', headlightLow: 'D3S', headlightHigh: 'H7', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Audi', model: 'Q7', headlightLow: 'D3S', headlightHigh: 'H7', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  
  // Volkswagen
  { make: 'Volkswagen', model: 'Golf', headlightLow: 'H7', headlightHigh: 'H7', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Volkswagen', model: 'Passat', headlightLow: 'H7', headlightHigh: 'H7', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Volkswagen', model: 'Tiguan', headlightLow: 'H7', headlightHigh: 'H7', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' },
  { make: 'Volkswagen', model: 'Polo', headlightLow: 'H7', headlightHigh: 'H7', fogLight: 'H11', turnSignalFront: '7440A', turnSignalRear: '7443', parkingLight: 'T10', tailLight: '7443', brakeLight: '7443', reverseLight: '921', licensePlate: '168' }
]

async function populateBulbData() {
  const items = bulbData.map(item => ({
    ...item,
    vehicleKey: `${item.make}#${item.model}`
  }))

  for (let i = 0; i < items.length; i += 25) {
    const chunk = items.slice(i, i + 25)
    const putRequests = chunk.map(item => ({
      PutRequest: { Item: item }
    }))

    await docClient.send(new BatchWriteCommand({
      RequestItems: {
        BulbData: putRequests
      }
    }))
    console.log(`Inserted ${Math.min(i + 25, items.length)} / ${items.length} items`)
  }

  console.log('✅ Bulb data populated successfully!')
}

populateBulbData().catch(console.error)
