// const firebaseConfig = {
//   apiKey: "AIzaSyB6RkG3YQAUBXE7_VTGnraVZ12-Lu8wsLk",
//   authDomain: "shoppinglistapp-ba3f6.firebaseapp.com",
//   databaseURL: "https://shoppinglistapp-ba3f6-default-rtdb.firebaseio.com",
//   projectId: "shoppinglistapp-ba3f6",
//   storageBucket: "shoppinglistapp-ba3f6.appspot.com",
//   messagingSenderId: "1012252348521",
//   appId: "1:1012252348521:web:8b6d96a76d487c690092f8",
//   measurementId: "G-B5L1GGM30Q"
// };

// firebase.initializeApp(firebaseConfig);

// const db = firebase.database();

// function addItem() {
//   const input = document.getElementById("itemInput");
//   const item = input.value.trim();
//   if (item) {
//     db.ref("shoppingList").push({ name: item, bought: false });
//     input.value = "";
//   }
// }

// function updateList(snapshot) {
//   const list = document.getElementById("shoppingList");
//   list.innerHTML = "";
//   snapshot.forEach((child) => {
//     const key = child.key;
//     const item = child.val();

//     const li = document.createElement("li");
//     li.textContent = item.name;

//     const deleteBtn = document.createElement("button");
//     deleteBtn.textContent = "❌";
//     deleteBtn.onclick = () => deleteItem(key);

//     li.appendChild(deleteBtn);
//     list.appendChild(li);
//   });
// }

// function deleteItem(key) {
//   db.ref("shoppingList/" + key).remove();
// }

// db.ref("shoppingList").on("value", updateList);


window.onload = () => {
  // קונפיג Firebase (שימי את שלך כאן)
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
  const db = firebase.database();

  const shoppingListRef = db.ref("shoppingList");

  const input = document.getElementById("itemInput");
  const list = document.getElementById("shoppingList");
  const clearListBtn = document.getElementById("clearListBtn");
  const confirmModal = document.getElementById("confirmModal");
  const confirmYes = document.getElementById("confirmYes");
  const confirmNo = document.getElementById("confirmNo");

  document.getElementById("addItemBtn").addEventListener("click", addItem);

  let editingKey = null; // למעקב אחרי הפריט בעריכה

  function addItem() {
    const item = input.value.trim();
    if (!item) {
      alert("נא להזין מוצר לפני ההוספה");
      return;
    }
    shoppingListRef.push({ name: item, bought: false });
    input.value = "";
    input.focus();
  }

  // מחיקת פריט בודד
  function deleteItem(key) {
    shoppingListRef.child(key).remove();
  }

  // כניסה למצב עריכה של פריט
  function editItem(key, currentName, li) {
    if (editingKey !== null) return; // לא מאפשרים עריכה כפולה

    editingKey = key;
    li.classList.add("editing");

    li.innerHTML = "";

    // שדה טקסט לעריכה
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.value = currentName;
    li.appendChild(editInput);

    // כפתור שמירת עריכה
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "💾";
    saveBtn.title = "שמור";
    saveBtn.className = "btn btn-primary";
    saveBtn.onclick = () => {
        const newName = editInput.value.trim();
        if (!newName) {
            alert("השם לא יכול להיות ריק");
            editInput.focus();
            return;
        }
        shoppingListRef.child(key).update({ name: newName });
        editingKey = null;
        renderList(lastSnapshot); // נוספה שורת רינדור מחדש
    };

    li.appendChild(saveBtn);

    // כפתור ביטול
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "❌";
    cancelBtn.title = "בטל";
    cancelBtn.className = "btn btn-secondary";
    cancelBtn.onclick = () => {
      editingKey = null;
      renderList(lastSnapshot);
    };
    li.appendChild(cancelBtn);

    editInput.focus();

    // אפשרות שמירת עריכה עם מקש Enter ו-Escape
    editInput.addEventListener("keyup", e => {
      if (e.key === "Enter") saveBtn.onclick();
      else if (e.key === "Escape") cancelBtn.onclick();
    });
  }

  // רינדור הרשימה
  let lastSnapshot = null;
  function renderList(snapshot) {
    lastSnapshot = snapshot;
    list.innerHTML = "";

    snapshot.forEach(child => {
      const key = child.key;
      const item = child.val();

      const li = document.createElement("li");

      if (editingKey === key) {
        // אם בעריכה, נמלא לפי הפונקציה editItem (תופעל בנפרד)
        editItem(key, item.name, li);
      } else {
        li.textContent = item.name;

        // כפתורי פעולה (עריכה ומחיקה)
        const btns = document.createElement("div");
        btns.className = "item-buttons";

        const editBtn = document.createElement("button");
        editBtn.innerHTML = "✏️";
        editBtn.title = "ערוך מוצר";
        editBtn.onclick = () => editItem(key, item.name, li);

        const delBtn = document.createElement("button");
        delBtn.innerHTML = "❌";
        delBtn.title = "מחק מוצר";
        delBtn.className = "btn-delete";
        delBtn.onclick = () => deleteItem(key);

        btns.appendChild(editBtn);
        btns.appendChild(delBtn);

        li.appendChild(btns);
      }
      list.appendChild(li);
    });
  }

  // מחיקת כל הרשימה עם אישור
  function clearList() {
    confirmModal.classList.remove("hidden");
  }

  confirmYes.onclick = () => {
    shoppingListRef.remove();
    confirmModal.classList.add("hidden");
  };

  confirmNo.onclick = () => {
    confirmModal.classList.add("hidden");
  };

  // מאזין לשינויים ב־Firebase
  shoppingListRef.on("value", renderList);

  // הוספת מוצר עם לחיצת Enter
  input.addEventListener("keyup", e => {
    if (e.key === "Enter") addItem();
  });
  clearListBtn.addEventListener("click", clearList);
};
