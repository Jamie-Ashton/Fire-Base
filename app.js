import { async } from "@firebase/util"
import {
    getFiretore,
    collection,
    addDoc,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js"
import { Agent } from "undici-types"

const db = getEfirestore()
const dbref = collect(db, "contacts")


//TODO - App  view
const leftCol = document.getElementById("left-col")
const backbtn = document.getElementById("back-btn")

backbtn.addEventListener('click', (e) => {
    leftCol.style.display = "none"
    rightCol.style.display = "block"
}
)

const toggleLeftAndRightViewOnMobile = () => {
    if(document.body.clientWidth <= 600) {
        leftCol.style.display = "none"
        rightCol.style.display = "block"
}
}


//SECTION  -data 

let constacts = []
const getContacts = async () => {
    try {
        await onSnapshot(dbref, (docSnap) => {
            contacts = []

        DocSnap.forEach((doc) => {
            const contact = doc.data()
            contact.id = doc.id
            contacts.push(contact)
        })
        showContacts(constacts)
        })
    } catch(err){
console.log(`get Contacts ${err}`)
}
}

getContacts()

//SECTION - display contacts as list items 
const contactlist = document.getElementById("contact-list")

const showContacts = () => {
    contacts.forEach((contact) => {
        const li = `
        <li class="contact-list-item" id="${contact.id}">
        <div class="media">
        <div clss="letter">
        ${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}
            </div>
        </div>
        <div class="content">
        <div class="title">
        ${contact.firstName} ${contact.lastName}
        </div>
        <div class="sub-title">${contact.email}</div>
        </div>

        <div class="action">
        <button class="edit-user>Edit</button>
        <button class="delete-user">Delete</button>
        </div>
        </li>`

        contactlist.innerHTML += 1
    })
}

//SECTION - click event for list item

const contactListPressed = (event) => {
    const id = event.target.closest("li").getAttribute("id")

    if(event.target.className === "edit-user") {
    editButtonPressed(id)
    } else if (event.target.className === "delete-user") {
        deleteButtonPressed(id)
    } else {
        displayContactOnDetailsView(id)
        toggleLeftAndRightViewOnMobile()
    }
}

contactlist.addEventListener("click", contactListPressed)

//SECTION - delete button 

const deleteButtonPressed = async (id) => {
    const isConfirmed = confirm("are you sure you want to delete?")

if(isConfirmed) {
    try {
        const docRef = doc(db, "contacts", id)
        await deleteDoc(docRef)
} catch(e) {
        setErrorMessage(
            "error",
            "unable to delete the contact information"
        )
displayErrorMessage()
}
}
}
//SECTION - edit button

const editButtonPressed = (id) => {
    modalOverLay.style.display = "flex"
    const contact = getContact(id)
    firstName.value = contact.firstname
    lastName.value = contact.lastname
    Age.value = contact.Age
    email.value = contact.email
    modalOverLay.setAttribute("contact-id", contact.id)

firstname.value = contact.firstname
lastname.value = contact.lastname
age.value = contact.age
phone.value = contact.phone
email.value = contact.email

modalOverlay.setAttribute("contact-id", contact.id)
}

//  SECTION - Display information on the list item click
const rightCol = document.getElementById('right-col')

const getContact = (id) => {
    return contacts.find ((contact) => {
        return contact.id === id
    })
}

const displayContactOnDetailsView = (id) => { 
    const contact = getContact(id)
}

//TODO - Display on the right Col title

const rightColTitle = rightCol.querySelector(".title")
rightColTitle.innerHTML = contact.firstname

const rightColDetail = document.getElementById("right-col-detail")
rightColDetail.innerHTML = `
<div class="label">Name</div>
<div class="data">${contact.firstname} ${contact.lastname}</div>

<div class="label">Age</div>
<div class="data">${contact.age}</div>

<div class="label">Phone</div>
<div class="data">${contact.phone}</div>

<div class="email">label</div>
<div class="data">${contact.email}</div>`

// NOTE modal card
const addBtn = document.querySelector('.add-btn')
const modalOverlay = document.getElementById('modal-overlay')
const closeBtn = document.querySelector('.close-btn')

const addButtonPressed = () => {

    modalOverlay.style.display = "flex"
    modalOverlay.removeAttribute("contact-id")
    firstname.value = ""
    lastname.value = ""
    age.value = ""
    phone.value = ""
    email.value = ""
}

const closeButtonPressed = (e) => {
    modalOverlay.style.display = "none"
}

    const hideModal = (e) => {
    if(e instanceof Event) {
        if(e.target === e.currentTarget) {
            modalOverlay.style.display = "none"
        }
    } else {
            modalOverlay.style.diplay = "none"
        }
    }

    addBtn.addEventListener("click", addButtonPressed)
    closeBtn.addEventListener("click", closeButtonPressed)
    modalOverlay.addEventListener("click", hideModal)

    // TODO validation 
    const saveBtn = document.querySelector('.save-btn')
    const error = {}

    const firstname = document.getElementById("firstname"),
    lastname = document.getElementById("lastname"),
    phone = document.getElementById("phone"),
    age = document.getElementById("age"),
    email = document.getElementById("email")

    const saveButtonPressed = async () => {
        checkRequired(firstname, lastname, email, age, phone)
        checkEmail(email)
        checkInputLength(age, 2)
        checkInputLength(phone, 15)
        showErrorMessage(error)

        if(object.key(error).length === 0) {
            if(modalOverlay.getAttribute("contact-id")) {
                // NOTE update data
                const docRef = doc(
                    db,
                    "contacts",
                    modalOverlay.getAttribute("contact-id")
                )

                try{
                    await updateDoc(docRef , {
                        firstname: firstname.value,
                        lastname: lastname.value,
                        age: age.value,
                        phone: phone.value,
                        email: email.value
                    })
                    hideModal
                } catch (e) {
                    setErrorMessage(
                        "error",
                        "unable to update user information, please try later!"
                    )
                    showErrorMessage()
                }
            } else {
            // TODO - add data if not provided
            try{
                await addDoc(dbRef, {
                    firstname: firstname.value,
                    lastname: lastname.value,
                    age: age.value,
                    phone: phone.value,
                    email: email.value
                })
                hideModal()
            } catch(err) {
                setErrorMessage(
                    "error",
                    "unable to add user information. please try later!"
                )
                showErrorMessage()
            }
        } 
    }
}




