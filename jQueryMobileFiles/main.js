//1. - home, lists all your Notes
//2. - add, lets you add a Note
// 3. - lets you delete a note.

// define an array to hold our data.  Later this should be stored on the sever
Spendings = [];
// save typing time, make up 3 for testing
Spendings.push(new Spending("Lunch at Restaurant", "Food", 50, 5, 18, 20));
Spendings.push(new Spending("New sweaters", "Clothing", 100, 3, 21, 20))
Spendings.push(new Spending("Videogames", "Gaming", 60, 4, 20, 20));
Spendings.push(new Spending("Snacks", "Food", 10, 5, 5, 20));

// Now comes the code that must wait to run until the document is fully loaded
document.addEventListener("DOMContentLoaded", function (event) {

    // update the li's on our homepage
    let listUl = document.getElementById("listUl");
    UpdateDisplay(listUl);  // call shared code with delete and home

    // sometimes you want data to be current as you switch from one page to another
    // to do that we get a DOM event  "pagebeforeshow"

    // this will refresh the data each time you navigate back to the Display page
    $(document).on('pagebeforeshow', '#Display', function () {
        let listUl = document.getElementById("listUl");
        UpdateDisplay(listUl);
    }
    );

    // this will refresh the data each time you navigate back to the Delete page
    $(document).on('pagebeforeshow', '#Delete', function () {
        let deleteListUl = document.getElementById("deleteListUl");
        UpdateDisplay(deleteListUl);   // call shared code with delete and home
        document.getElementById("deleteItem").value = "";  // clear this text box
    }
    );


     // this will clear the text boxes  each time you navigate back to the Add page
     $(document).on('pagebeforeshow', '#Add', function () {
        document.getElementById("title").value = ""; 
        document.getElementById("detail").value = ""; 
        document.getElementById("priority").value  = ""; 
    }
    );

    // add a button event for adding new notes on Add page
    document.getElementById("newItem").addEventListener("click", function () {
        // use constructor, build new object and put it in array
        Spendings.push( new Note( document.getElementById("title").value, 
        document.getElementById("detail").value,
        document.getElementById("priority").value ) );
     });

     // add a button even for deleting a note on Delete page
     document.getElementById("delete").addEventListener("click", function () {
        let which = document.getElementById("deleteItem").value;
        let found = false;
        for(var i = 0; i < Spendings.length; i++) // find the match
        {
            if(Spendings[i].title === which){
                Spendings.splice(i,1);  // remove object from array
                found = true;
            }
        }
        if(!found){
            document.getElementById("deleteItem").value = "Sorry, could not find";
        }

     });
 

});  // end of code that must wait for document to load before running

// our constructor
function Spending(pTitle, pType, pPrice, pDateMonth, pDateDay, pDateYear) {
    this.title= pTitle;
    this.type = pType;
    this.price = pPrice;
    this.dateMonth = pDateMonth;
    this.dateDay = pDateDay;
    this.dateYear = pDateYear;
  }

// this function is used by Display page to add li's to the listUl on the page
 function UpdateDisplay(whichElement) {
    whichElement.innerHTML = "";
    // sort by date (don't know if this is the best way of accomplishing this)
    Spendings.sort(function(a, b) {
        if (a.dateYear > b.dateYear)
        { return +1; }
        if (a.dateYear < b.dateYear)
        { return -1; }
        if (a.dateYear = b.dateYear)
        {
            if (a.dateMonth > b.dateMonth)
            { return +1; }
            if (a.dateMonth < b.dateMonth)
            { return -1; }
            if (a.dateMonth = b.dateMonth)
            {
                if (a.dateDay > b.dateDay)
                { return +1; }
                if (a.dateDay < b.dateDay)
                { return -1; }
                if (a.dateDay = b.dateDay)
                { return 0; }
            }
        }

    });
    Spendings.forEach(function(item, index) {
        var li = document.createElement('li');
        whichElement.appendChild(li);
        li.innerHTML=li.innerHTML + item.dateMonth +"/"+ item.dateDay+"/"+ item.dateYear +" - <b>" + item.type + ":</b> " + item.title + ".  " + " $" + item.price;
    }); // build one li for each item in array
 }


