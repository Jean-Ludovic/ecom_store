// seedFirestore.js
const admin = require('firebase-admin');
const path = require('path');

// Charge la clé de service
const serviceAccount = require('./serviceAccountKey.json');

// Initialise l'app admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seed() {
  try {
    console.log('🔥 Début du seed Firestore...');

    // ====== COLLECTION USERS ======
    const users = [
      {
        id: 'user_demo_1',
        data: {
          fullname: 'Demo User',
          avatar: '',
          banner: '',
          email: 'demo.user@example.com',
          address: '',
          basket: [],
          mobile: { data: {} },
          role: 'USER',
          dateJoined: Date.now()
        }
      }
    ];

    for (const u of users) {
      await db.collection('users').doc(u.id).set(u.data, { merge: true });
      console.log(`✅ User créé: ${u.id}`);
    }

    // ====== COLLECTION CATEGORIES ======
    const categories = [
      {
        id: 'sport',
        data: {
          name: 'Sport',
          description: 'Sport cars category'
        }
      },
      {
        id: 'luxury',
        data: {
          name: 'Luxury',
          description: 'Luxury cars category'
        }
      }
    ];

    for (const c of categories) {
      await db.collection('categories').doc(c.id).set(c.data, { merge: true });
      console.log(`✅ Category créée: ${c.id}`);
    }
    // Create user in Firebase Auth
const authUser = await admin.auth().createUser({
  uid: 'user_demo_1',
  email: 'demo.user@example.com',
  password: 'password123',
  displayName: 'Demo User'
});

console.log('✅ Auth user created:', authUser.uid);


    // ====== COLLECTION PRODUCTS ======
// ====== COLLECTION PRODUCTS ======
const products = [
  {
    id: 'car_11',
    data: {
      name: 'Car 11',
      brand: 'Ferrari',
      price: 120000,
      maxQuantity: 5,
      description: 'High performance sports car.',
      keywords: ['car', 'sport', 'ferrari'],
      sizes: [48, 50, 52],                         // valeurs arbitraires
      isFeatured: true,
      isRecommended: true,
      availableColors: ['#000000', '#ff0000', '#ffffff'], // noir, rouge, blanc
      image: 'https://res.cloudinary.com/daq38n1s0/image/upload/v1763704280/11_ga329l.jpg',
      imageCollection: [
        {
          id: 'car_11_main',
          url: 'https://res.cloudinary.com/daq38n1s0/image/upload/v1763704280/11_ga329l.jpg'
        }
      ],
      category: 'sport',
      stock: 5,
      sold: 0,
      createdAt: Date.now()
    }
  },
  {
    id: 'car_10',
    data: {
      name: 'Car 10',
      brand: 'Lamborghini',
      price: 110000,
      maxQuantity: 5,
      description: 'Exotic supercar.',
      keywords: ['car', 'sport', 'lamborghini'],
      sizes: [48, 50, 52],
      isFeatured: true,
      isRecommended: false,
      availableColors: ['#000000', '#ffaa00', '#ffffff'],
      image: 'https://res.cloudinary.com/daq38n1s0/image/upload/v1763704280/10_s94fhg.jpg',
      imageCollection: [
        {
          id: 'car_10_main',
          url: 'https://res.cloudinary.com/daq38n1s0/image/upload/v1763704280/10_s94fhg.jpg'
        }
      ],
      category: 'sport',
      stock: 4,
      sold: 0,
      createdAt: Date.now()
    }
  }
  // ajoute tes autres voitures ici...
];

    for (const p of products) {
      await db.collection('products').doc(p.id).set(p.data, { merge: true });
      console.log(`✅ Product créé: ${p.id}`);
    }

    // ====== COLLECTION ORDERS (optionnel pour juste créer la collection) ======
    const orders = [
      {
        id: 'order_demo_1',
        data: {
          basket: [],
          amount: 0,
          deliveryStatus: 'pending',
          orderStatus: 'ordered',
          user: 'user_demo_1',
          orderedAt: Date.now()
        }
      }
    ];

    for (const o of orders) {
      await db.collection('orders').doc(o.id).set(o.data, { merge: true });
      console.log(`✅ Order créé: ${o.id}`);
    }

    console.log('🎉 Seed terminé avec succès !');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur pendant le seed:', err);
    process.exit(1);
  }
}

seed();
