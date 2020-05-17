const ItemCtrl = (function () {
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  const data = {
    items: [
      //   { id: 0, name: 'Steak Dinner', calories: 1200 },
      //   { id: 1, name: 'Cookie', calories: 400 },
      //   { id: 2, name: 'Eggs', calories: 300 },
    ],
    currentItem: null,
    totalCalories: 0,
  };

  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let id;
      if (data.items.length > 0) {
        id = data.items[data.items.length - 1].id + 1;
      } else {
        id = 0;
      }

      calories = parseInt(calories);

      newItem = new Item(id, name, calories);

      data.items.push(newItem);

      return newItem;
    },
    getItemById: function (id) {
      let found = null;

      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });

      return found;
    },
    updateItem: function (name, calories) {
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    deleteItem: function (id) {
      const ids = data.items.map(function (item) {
        return item.id;
      });

      const index = ids.indexOf(id);

      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function () {
      let total = 0;

      data.items.forEach(function (item) {
        total += item.calories;
      });

      data.totalCalories = total;

      return data.totalCalories;
    },
    logData: function () {
      return data;
    },
  };
})();

const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemName: '#item-name',
    itemCalories: '#item-calories',
    totalCalories: '.total-calories',
  };
  return {
    populate: function (items) {
      let output = '';

      items.forEach(function (item) {
        output += `
        <li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong> 
            <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class=" edit-item fa fa-pencil"></i>
            </a>
        </li>`;
      });

      document.querySelector(UISelectors.itemList).innerHTML = output;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemName).value,
        calories: document.querySelector(UISelectors.itemCalories).value,
      };
    },
    addListItem: function (item) {
      document.querySelector(UISelectors.itemList).style.display = 'block';

      const li = document.createElement('li');

      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      li.innerHTML = `
        <strong>${item.name}: </strong> 
        <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
            <i class=" edit-item fa fa-pencil"></i>
        </a>`;
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement('beforeend', li);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemId = listItem.getAttribute('id');
        if (itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `
            <strong>${item.name}: </strong> 
            <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class=" edit-item fa fa-pencil"></i>
            </a>`;
        }
      });
    },
    deleteListItem: function (id) {
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);

      item.remove();
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemName).value = '';
      document.querySelector(UISelectors.itemCalories).value = '';
    },
    addItemToForm: function () {
      document.querySelector(
        UISelectors.itemName
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCalories
      ).value = ItemCtrl.getCurrentItem().calories;

      UICtrl.showEditState();
    },
    clearAllItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);

      listItems.forEach(function (item) {
        item.remove();
      });
    },
    hideEmptyList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    clearEditState: function () {
      UICtrl.clearInput();

      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    getSelectors: function () {
      return UISelectors;
    },
  };
})();

const App = (function (ItemCtrl, UICtrl) {
  const eventListeners = function () {
    const UISelectors = UICtrl.getSelectors();

    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', itemAddSubmit);

    document
      .querySelector(UISelectors.itemList)
      .addEventListener('click', itemEditClick);

    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener('click', itemUpdateSubmit);

    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener('click', itemDeleteSubmit);

    document
      .querySelector(UISelectors.backBtn)
      .addEventListener('click', itemBackSubmit);

    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener('click', clearAllItems);

    /* Disabling enter key because enter adds meal 
    instead of updating, 'which' supported in older 
    browsers */
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();

        return false;
      }
    });
  };

  const itemAddSubmit = function (e) {
    const input = UICtrl.getItemInput();

    if (input.name !== '' && input.calories !== '') {
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      UICtrl.addListItem(newItem);

      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);

      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  const itemEditClick = function (e) {
    if (e.target.classList.contains('edit-item')) {
      const listId = e.target.parentNode.parentNode.id;
      const listIdArr = listId.split('-');
      const id = parseInt(listIdArr[1]);

      const itemToEdit = ItemCtrl.getItemById(id);

      ItemCtrl.setCurrentItem(itemToEdit);

      UICtrl.addItemToForm();
    }

    e.preventDefault();
  };

  const itemUpdateSubmit = function (e) {
    const input = UICtrl.getItemInput();

    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    UICtrl.updateListItem(updatedItem);

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  const itemDeleteSubmit = function (e) {
    const currentItem = ItemCtrl.getCurrentItem();

    ItemCtrl.deleteItem(currentItem.id);

    UICtrl.deleteListItem(currentItem.id);

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    const items = ItemCtrl.getItems();

    if (items.length === 0) UICtrl.hideEmptyList();

    e.preventDefault();
  };

  const itemBackSubmit = function (e) {
    UICtrl.clearEditState();

    e.preventDefault();
  };

  const clearAllItems = function () {
    ItemCtrl.clearAllItems();

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearAllItems();

    UICtrl.hideEmptyList();
  };

  return {
    init: function () {
      UICtrl.clearEditState();

      const items = ItemCtrl.getItems();

      if (items.length === 0) UICtrl.hideEmptyList();
      else UICtrl.populate(items);

      /* Called when initialized because upon page opening, 
      there could be items in localStorage */
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);

      eventListeners();
    },
  };
})(ItemCtrl, UICtrl);

App.init();
