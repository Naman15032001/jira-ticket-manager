//console.log("linked");
let  modalCont=document.querySelector(".modal-cont");
let addBtn=document.querySelector(".add-btn");
let mainCont=document.querySelector(".main-cont");
let textCont=document.querySelector(".textarea-cont");
let removeBtn=document.querySelector(".remove-btn");
let allPriorityColor=document.querySelectorAll(".priority-color");

let toolBoxColors=document.querySelectorAll(".color");

//problem in edit in filter




let addFlag=false;

let colors=['lightpink','lightblue','lightgreen','black']

let modalPriorityColor=colors[colors.length-1];

let removeFlag=false;


let lockClass="fa-lock";
let unlockClass="fa-lock-open";


let ticketsArr=[];

if(localStorage.getItem("jira_tickets")){

    //retrieve and display tickets
    ticketsArr=JSON.parse(localStorage.getItem("jira_tickets"));
    ticketsArr.forEach((ticketObj,idx)=>{

        createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.id);

    })


}


toolBoxColors.forEach((toolBoxEle,idx)=>{


    toolBoxEle.addEventListener('click',(e)=>{

        let currentToolBoxColor=toolBoxEle.classList[0];

       let filteredTickets= ticketsArr.filter((ticketObj,idx)=>{

            return currentToolBoxColor===ticketObj.ticketColor;


        })
        let allTicketsCont=document.querySelectorAll(".ticket-cont");
        // remove
        for (let i = 0; i < allTicketsCont.length; i++) {
            allTicketsCont[i].remove();
            
        }

        //display new filtered tickets

        filteredTickets.forEach((ticketObj,idx)=>{

            createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.id);

        })


    })

    toolBoxEle.addEventListener("dblclick",(e)=>{

        let allTicketsCont=document.querySelectorAll(".ticket-cont");
        // remove
        for (let i = 0; i < allTicketsCont.length; i++) {
            allTicketsCont[i].remove();
            
        }

        ticketsArr.forEach((ticketObj,idx)=>{

            createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.id);


        })


        
    })
})



//listener for  modal priority coloring

allPriorityColor.forEach((colorElem,idx)=>{

    colorElem.addEventListener('click',(e)=>{

        allPriorityColor.forEach((priorityColorElem,idx)=>{

            priorityColorElem.classList.remove("border");
        });

     colorElem.classList.add("border");   

     modalPriorityColor=colorElem.classList[0];



    });


})



removeBtn.addEventListener('click',(e)=>{

    
    removeFlag=!removeFlag;
    console.log(removeFlag);
     
})


addBtn.addEventListener('click',(e)=>{

    //display ticket modal
    //generate ticket
    // add flag true display modal
    // add flag true display remove modal

    addFlag=!addFlag;
     if(addFlag){
         modalCont.style.display="flex";

     }
     else{
        modalCont.style.display="none";

     }



})

modalCont.addEventListener("keydown",(e)=>{
    let key=e.key;
    if(key==='Shift'){
        createTicket(modalPriorityColor,textCont.value);
        addFlag=false;
        setModalToDefault();
    }
})

function createTicket(ticketColor,ticketTask,ticketId){

    let id=ticketId || shortid();

    let ticketCont=document.createElement("div");
    ticketCont.setAttribute("class","ticket-cont");
    ticketCont.innerHTML=`
    <div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock"><i class="fas fa-lock"></i></div>
    `;
    mainCont.appendChild(ticketCont);

    //create object of ticket and add to array

    if(!ticketId){
        ticketsArr.push({ticketColor,ticketTask,id})
        localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
    }

    


    handleRemoval(ticketCont,id);

    handleLock(ticketCont,id);

    handleColor(ticketCont,id);



}




function handleRemoval(ticket,id){

    //removeFlag true remove  

    ticket.addEventListener('click',(e)=>{

        let ticketIdx=getTicketIdx(id);
        if(removeFlag){
            
            ticketsArr.splice(ticketIdx,1) //db removal
            localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
            ticket.remove(); //ui removal
        }
    });

   

    

}
function handleLock(ticket,id){


    let lockElem=ticket.querySelector(".ticket-lock");
    let ticketLock=lockElem.children[0];
    let ticketTaskArea=ticket.querySelector(".task-area");
    ticketLock.addEventListener("click",(e)=>{

        let ticketIdx=getTicketIdx(id);

        if(ticketLock.classList.contains(lockClass)){

            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable","true");


        }
        else{
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable","false");

        }
        
        //modify data in local storage (ticket task)

        ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));



    })
}

function handleColor(ticket,id){






    let ticketColor=ticket.querySelector(".ticket-color");


    ticketColor.addEventListener('click',(e)=>{

        let ticketIdx=getTicketIdx(id);

        let currColor=ticketColor.classList[1];

    let idx=colors.findIndex((color)=>{
        return color===currColor;
    });
    idx++;
    let newIdx=(idx)%(colors.length);
    let newTicketColor=colors[newIdx];
    ticketColor.classList.remove(currColor);
    ticketColor.classList.add(newTicketColor);


    //modify data in local storage priority color change

    ticketsArr[ticketIdx].ticketColor =newTicketColor;
    localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));




    });

    

    
}

function setModalToDefault(){

    modalCont.style.display="none";
    textCont.value="";
    modalPriorityColor=colors[colors.length-1]

   

        allPriorityColor.forEach((priorityColorElem,idx)=>{

            priorityColorElem.classList.remove("border");
        });

     allPriorityColor[allPriorityColor.length-1].classList.add("border");

  
}

function getTicketIdx(id){

    let ticketIdx=ticketsArr.findIndex((ticketObj)=>{
        return ticketObj.id===id;
    })
    return ticketIdx;




}