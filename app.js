window.onload = () => {
  console.log("האפליקציה נטענה");
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
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  const shoppingListRef = db.ref("shoppingList");

  const input = document.getElementById("itemInput");
  const list = document.getElementById("shoppingList");
  const clearListBtn = document.getElementById("clearListBtn");
  const confirmInline = document.getElementById("confirmInline");
  const confirmYes = document.getElementById("confirmYes");
  const confirmNo = document.getElementById("confirmNo");
  const errorInline = document.getElementById("errorInline");

  document.getElementById("addItemBtn").addEventListener("click", addItem);

  let editingKey = null; 
  let lastSnapshot = null;

  function addItem() {
    const item = input.value.trim();
    if (!item) {
      errorInline.classList.add("show");
      input.focus();

      setTimeout(() => {
        errorInline.classList.remove("show");
      }, 3000);

      const clearError = () => {
        errorInline.classList.remove("show");
        input.removeEventListener("input", clearError);
      };
      input.addEventListener("input", clearError);

      return;
    }

    errorInline.classList.remove("show");
    shoppingListRef.push({ name: item, bought: false });
    input.value = "";
    input.focus();
  }

  function deleteItem(key) {
    shoppingListRef.child(key).remove();
  }

  function editItem(key, currentName, li) {
    if (editingKey !== null) return; 

    editingKey = key;
    li.classList.add("editing");
    li.innerHTML = "";

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.value = currentName;
    li.appendChild(editInput);

    // כפתור שמירה (SVG)
    const saveBtn = document.createElement("button");
    saveBtn.className = "btn-icon";
    saveBtn.title = "שמור";
    saveBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>`;
    saveBtn.onclick = () => {
      const newName = editInput.value.trim();
      if (!newName) {
        alert("השם לא יכול להיות ריק");
        editInput.focus();
        return;
      }
      shoppingListRef.child(key).update({ name: newName });
      editingKey = null;
      renderList(lastSnapshot);
    };
    li.appendChild(saveBtn);

    // כפתור ביטול (SVG)
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "btn-icon btn-delete";
    cancelBtn.title = "בטל";
    cancelBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>`;
    cancelBtn.onclick = () => {
      editingKey = null;
      renderList(lastSnapshot);
    };
    li.appendChild(cancelBtn);

    editInput.focus();

    editInput.addEventListener("keyup", e => {
      if (e.key === "Enter") saveBtn.onclick();
      else if (e.key === "Escape") cancelBtn.onclick();
    });
  }

  function renderList(snapshot) {
    lastSnapshot = snapshot;
    list.innerHTML = "";

    snapshot.forEach(child => {
      const key = child.key;
      const item = child.val();

      const li = document.createElement("li");
      li.className = "shopping-item";

      if (editingKey === key) {
        editItem(key, item.name, li);
      } else {
        const spanName = document.createElement("span");
        spanName.className = "item-name";
        spanName.textContent = item.name;
        li.appendChild(spanName);

        const btns = document.createElement("div");
        btns.className = "item-buttons";

        // כפתור עריכה (עט SVG מינימליסטי)
        const editBtn = document.createElement("button");
        editBtn.className = "btn-icon";
        editBtn.title = "ערוך מוצר";
        editBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
          </svg>`;
        editBtn.onclick = () => editItem(key, item.name, li);

        // כפתור מחיקה (X SVG מינימליסטי אדום)
        const delBtn = document.createElement("button");
        delBtn.className = "btn-icon btn-delete";
        delBtn.title = "מחק מוצר";
        delBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>`;
        delBtn.onclick = () => deleteItem(key);

        btns.appendChild(editBtn);
        btns.appendChild(delBtn);
        li.appendChild(btns);
      }
      list.appendChild(li);
    });
  }

  clearListBtn.addEventListener("click", () => {
    confirmInline.classList.add("show");
  });

  confirmYes.onclick = () => {
    shoppingListRef.remove();
    confirmInline.classList.remove("show");
  };

  confirmNo.onclick = () => {
    confirmInline.classList.remove("show");
  };

  shoppingListRef.on("value", renderList);

  input.addEventListener("keyup", e => {
    if (e.key === "Enter") addItem();
  });
};
