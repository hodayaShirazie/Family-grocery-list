// קונפיג של Firebase (השלימי עם מה שקיבלת מהקונסולה)
const firebaseConfig = {
  apiKey: "AIzaSyB6RkG3YQAUBXE7_VTGnraVZ12-Lu8wsLk",
  authDomain: "shoppinglistapp-ba3f6.firebaseapp.com",
  databaseURL: "https://shoppinglistapp-ba3f6-default-rtdb.firebaseio.com",
  projectId: "shoppinglistapp-ba3f6",
  storageBucket: "shoppinglistapp-ba3f6.appspot.com",
  messagingSenderId: "1012252348521",
  appId: "1:1012252348521:web:8b6d96a76d487c690092f8",
  measurementId: "G-B5L1GGM30Q"
};

// אתחול Firebase
firebase.initializeApp(firebaseConfig);

// קישור למסד הנתונים
const db = firebase.database();

// פונקציה להוספת פריט לרשימה
function addItem() {
  const input = document.getElementById("itemInput");
  const item = input.value.trim();
  if (item) {
    db.ref("shoppingList").push({ name: item, bought: false });
    input.value = "";
  }
}

// מאזין לשינויים ברשימה ומציג אותה בדף
function updateList(snapshot) {
  const list = document.getElementById("shoppingList");
  list.innerHTML = "";
  snapshot.forEach((child) => {
    const key = child.key;
    const item = child.val();

    const li = document.createElement("li");
    li.textContent = item.name;

    // כפתור מחיקה
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.onclick = () => deleteItem(key);

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

// פונקציית מחיקה
function deleteItem(key) {
  db.ref("shoppingList/" + key).remove();
}

// מאזין לעדכונים ב-Firebase
db.ref("shoppingList").on("value", updateList);
