// define an array to hold our data.  Later this should be stored on the sever
Spendings = [];
// for the chart page
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;
function rectangle(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    ctx.fillStyle = color;
    ctx.fillRect(this.x,this.y,this.width,this.height);
};

// Now comes the code that must wait to run until the document is fully loaded
document.addEventListener("DOMContentLoaded", function (event) {

    // update the li's
    let listUl = document.getElementById("listUl");
    UpdateDisplay(listUl);
    //update canvas
    document.getElementById("chartDiv").appendChild(canvas);

    // this will refresh the data each time you navigate back to the Display page
    $(document).on('pagebeforeshow', '#Display', function () {
        let listUl = document.getElementById("listUl");
        UpdateDisplay(listUl);
    }
    );

    // this will refresh the data each time you navigate back to the Edit page
    $(document).on('pagebeforeshow', '#Edit', function () {
        let editListUl = document.getElementById("editListUl");
        UpdateDisplay(editListUl);
        //document.getElementById("deleteItem").value = "";
        document.getElementById("title").value = ""; 
        document.getElementById("type").value = ""; 
        document.getElementById("price").value  = ""; 
        document.getElementById("dateMonth").value = "";
        document.getElementById("dateDay").value = "";
        document.getElementById("dateYear").value = "";
    }
    );
    $(document).on('pagebeforeshow', '#Chart', function() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        var foodAmt = 0;
        var techAmt = 0;
        var clothAmt = 0;
        var miscAmt = 0;
        for(var i = 0; i < Spendings.length; i++)
        {
            if(Spendings[i].type == "Food"){
                foodAmt = foodAmt + Spendings[i].price;
            }
            if(Spendings[i].type == "Technology"){
                techAmt = techAmt + Spendings[i].price;
            }
            if(Spendings[i].type == "Clothing"){
                clothAmt = clothAmt + Spendings[i].price;
            }
            if(Spendings[i].type == "Miscellaneous"){
                miscAmt = miscAmt + Spendings[i].price;
            }
        }
        foodRect = new rectangle(50,foodAmt,"red", 20, 50);
        techRect = new rectangle(50,techAmt,"blue",90, 50);
        clothRect = new rectangle(50, clothAmt, "green",160, 50);
        miscRect = new rectangle(50, miscAmt, "purple", 230, 50);
    }
    );

    // add a button event for adding new notes on Edit page
    document.getElementById("newItem").addEventListener("click", function () {
        // use constructor, build new object and put it in array
        let newSpending = new Spending( document.getElementById("title").value, 
        document.getElementById("type").value,
        document.getElementById("price").value, 
        document.getElementById("dateMonth").value,
        document.getElementById("dateDay").value,
        document.getElementById("dateYear").value );
        
        $.ajax({
            url: "/AddSpending",
            type: "POST",
            data: JSON.stringify(newSpending),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(result){
                console.log(result);
                document.location.href = "index.html#Display";
            }
        });
     });

     // add a button even for deleting a note on Edit page
     document.getElementById("delete").addEventListener("click", function () {
        let which = document.getElementById("deleteItem").value;
        which = which - 1;
        $.ajax({
            type: "DELETE",
                url: "/DeleteSpending/" +which,
                success: function(result){
                    console.log(result);
                    document.location.href = "index.html#Display";
                },
                error: function(xhr, textStatus, errrorThrown) {
                    console.log('error in operation');
                    alert("server could not delete item")
                }
        });

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
    $.get("/getAllSpendings", function(data,status){
        Spendings = data;
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
        li.innerHTML=li.innerHTML+ (index + 1) + " -- " + item.dateMonth +"/"+ item.dateDay+"/"+ item.dateYear +" - <b>" + item.type + ":</b> " + item.title + ".  " + " $" + item.price;
    }); // build one li for each item in array
});
}


