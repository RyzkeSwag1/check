// Storage Controller
const StorageCtrl = (function(){
    //Public m ethods
    return {
        storeItem: function(item){
            let items;
            // Check if any items in LS
            if(localStorage.getItem('items')===null){
                items = [];
                //push new item
                items.push(item);
                //Set ls
                localStorage.setItem('items', JSON.stringify(items));

            } else {
                items = JSON.parse(localStorage.getItem('items'));
                //Push new item

                items.push(item);
                //Reset LS
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items')===null){
                items = []
            } else {
                items = JSON.parse(localStorage.getItem('items'))
            }
            return items
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));

        },
        clearFromLS: function(){
            localStorage.removeItem('items')
        }
    }
})();

// Item Controller
const ItemCtrl = (function(){
    // Item COnstructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    };

    //Data Structure / State
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    };

    return {
        getItems: function(){
            return data.items;
        },
        addItem(name,calories){
            let ID;
            // Create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length-1].id +1;

            } else {
                ID = 0;
            }
            //Calories to number
           calories = parseInt(calories);

           // Create new item
           newItem = new Item(ID, name, calories);
           data.items.push(newItem);

           return newItem;
        },
        getItemByID: function(id){
            let found = null;
            //loop through items
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }

            });
            return found;
        },
        updateItem: function(name, calories){
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },
        deleteItem: function(id){
            // Get ids
           const ids = data.items.map(function(item){
                return item.id;
            });

            // Get Index
            const index = ids.indexOf(id);

            //Remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = [];
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;

            data.items.forEach(function(item){
                total += item.calories;
            });
            data.totalCalories = total;

            return data.totalCalories;
        },
        logData: function(){
            return data;
        }
    };
})();

// UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        listItems: '#item-list li',
        clearBtn: '.clear-btn'
    };
    return {
        populateItemList: function(items){
            let html = '';

            items.forEach(function(item){
               html += `<li id="item-${item.id}" class="collection-item">
               <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>`;
            });
            //Inerst html
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            };
        },
        addListItem: function(item){
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //Create li element
            const li = document.createElement('li');
            //Add class
            li.className = 'collection-item';
            //Add id
            li.id = `item-${item.id}`;
            //Add HTML
            li.innerHTML =  `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;
            //Insert Item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // Turn Node list into Array
            listItems = Array.from(listItems);
            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');
                if(itemID ===`item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`;

                }
            });
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';

        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
            
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn node list into array
            listItems = Array.from(listItems);
            listItems.forEach(function(item){
                item.remove();
            });
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(total){
            document.querySelector(UISelectors.totalCalories).textContent = total;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function() {
            return UISelectors;
        }
    };
})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
    //Load Event Listeners
    const loadEventListeners = function(){
        //Get UI Selectors
        const UISelectors = UICtrl.getSelectors();
        //Add Item Event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        //Disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });
        //Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
    
        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
          // Delete BTN event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
        // Back BTN event;
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
      // Delete BTN event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    };

    //Add item submit
    const itemAddSubmit = function(e) {
     // Get form input from UI contoller
     const input = UICtrl.getItemInput();
    
        if(input.name !== '' && input.calories !==''){
           // Add item
           const newItem = ItemCtrl.addItem(input.name, input.calories);
            // Add item to UI
            UICtrl.addListItem(newItem);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add to UI
            UICtrl.showTotalCalories(totalCalories);
            //Store in LS
            StorageCtrl.storeItem(newItem)

            // Clear fields
            UICtrl.clearInput();
        }
 
        e.preventDefault();

    };

    //Update item submit
    const itemEditClick = function(e){

        if(e.target.classList.contains('edit-item')){
           // Get list item id
           const listId = e.target.parentNode.parentNode.id;

           //Break into array
           const listIdArr = listId.split('-');
           
          //Get actual ID
          const id = parseInt(listIdArr[1]);

          //Get item
          const itemToEdit = ItemCtrl.getItemByID(id);

          
          //Set current item
          ItemCtrl.setCurrentItem(itemToEdit);
          //Add item to form
          UICtrl.addItemToForm();


        }
        e.preventDefault();
    };

    //Update item sumit
    const itemUpdateSubmit = function(e){
        //Get item input
        const input = UICtrl.getItemInput();

        //Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //Update ui
        UICtrl.updateItem(updatedItem); 

           // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add to UI
            UICtrl.showTotalCalories(totalCalories);
            //Update LS
            StorageCtrl.updateItemStorage(updatedItem)
            UICtrl.clearEditState();
        
        e.preventDefault();
    };

    //Delete button event 
    const itemDeleteSubmit = function(e) {
        //Get current item
        const currentItem = ItemCtrl.getCurrentItem();
        //Delete from DS
        ItemCtrl.deleteItem(currentItem.id);
        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        const totalCalories = ItemCtrl.getTotalCalories();
        //Add to UI
        UICtrl.showTotalCalories(totalCalories);

        //Deletw from LS
        StorageCtrl.deleteItemFromStorage(currentItem.id);
        UICtrl.clearEditState();

        e.preventDefault();
    };

    //Clear items event
    const clearAllItemsClick = function(){
        //DelAll items
        ItemCtrl.clearAllItems();
        //REmove from UI
        UICtrl.removeItems();
        const totalCalories = ItemCtrl.getTotalCalories();
        //Clear fron LS
        StorageCtrl.clearFromLS()
        //Add to UI
        UICtrl.showTotalCalories(totalCalories);
        UICtrl.clearEditState();
        UICtrl.hideList();
    };
   return {
       init: function(){
           //Clear edit state
           UICtrl.clearEditState();
           //Fetch items
           const items = ItemCtrl.getItems();

           //Check if any items
           if(items.length === 0){
               UICtrl.hideList();
           } else {
            
               //Populate list with items
            UICtrl.populateItemList(items);
           }
           
// Get total calories
const totalCalories = ItemCtrl.getTotalCalories(); //Add to UI
UICtrl.showTotalCalories(totalCalories);
           

           // Load event listeners
           loadEventListeners();

           
       }
   };

})(ItemCtrl,StorageCtrl, UICtrl);

//Init App

App.init();