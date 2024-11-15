async function verification(){
    let signUpEmail = document.getElementById("signUpEmail").value
    if(signUpEmail=== ""){
        let systemMessage = "Enter your email"
        messageBox(systemMessage,false)
        return
    }
    console.log(signUpEmail)
    localStorage.setItem("email",signUpEmail)
    const response = await axios.post("http://localhost:3000/verification",{
        email: signUpEmail
    })
    
    console.log(response.data)
    if(response.data.message == "Otp has been sent to your email"){
        let systemMessage = response.data.message 
        messageBox(systemMessage , true)
        localStorage.setItem("otp",response.data.otp)
        setTimeout(function(){
            localStorage.removeItem("otp")
        },300000000)
        let signUpPage = document.getElementById("signUpPage")
        signUpPage.style.display = "none"
        let otpPage = document.getElementById("otpPage")
        otpPage.style.display = "block"
    }
    else{
        let systemMessage = response.data.message
        messageBox(systemMessage,false)
    }
}

async function verifyOTP(){
    const otp = document.getElementById("verifyOtp").value
    if(otp === ""){
        let systemMessage = "Enter Otp"
        messageBox(systemMessage,false)
        return
    }
    const response = await axios.post("http://localhost:3000/otp",{
        otp: otp,
        hashedOtp: localStorage.getItem("otp")
    })
    console.log(response.data)
    if(response.data.message == "Create Your Password"){
        let systemMessage = response.data.message
        messageBox(systemMessage , true)
        let otpPage = document.getElementById("otpPage")
        otpPage.style.display = "none"
        let passowordPage = document.getElementById("passwordPage")
        passowordPage.style.display = "block"
    }
    else{
        let systemMessage = "Incorrect OTP"
        messageBox(systemMessage , false)
    }
}

async function signUp(){
    const password = document.getElementById("password").value
    const name = document.getElementById("name").value
    if(password === "" || name === ""){
        let systemMessage = "Enter password & name"
        messageBox(systemMessage,false)
        return
    }
    const response = await axios.post("http://localhost:3000/signUp",{
        password: password,
        email: localStorage.getItem("email"),
        name: name
    })
    console.log(response.data)
    if(response.data.message == "Your account has been created"){
        let systemMessage = response.data.message
        await messageBox(systemMessage,true)
        systemMessage = "Sign in to authenticate"
        await messageBox(systemMessage,true)
        let passowordPage = document.getElementById("passwordPage")
        passowordPage.style.display = "none"
        let signIn = document.getElementById("signIn")
        signIn.style.display = "block"
    }
    else{
        let systemMessage = "Password must be at least 8 characters, with uppercase, lowercase, and a number or special character"
        messageBox(systemMessage,false)
    }
}

async function signIn(){
    const email = document.getElementById("emailSignIn").value
    const password = document.getElementById("passwordSignIn").value
    if(email === "" || password === "" ){
        let systemMessage = "Enter email & password"
        messageBox(systemMessage,false)
        return 
    }
    const response = await axios.post("http://localhost:3000/signIn",{
        email: email,
        password: password
    })
    console.log(response)
    if(response.data.message == "Sign In Successful"){
        let systemMessage = "Sign In Successful"
        messageBox(systemMessage,true)
        localStorage.setItem("token",response.data.token)
        window.location.href = "todo.html"
    }    
    else{
        let systemMessage = "Incorrect credentials"
        messageBox(systemMessage,false)
    }
}

async function readTask(token){
    const response = await axios.get("http://localhost:3000/readTask",{
        headers:{
            token: token
        }
    })
    let allTaskList = document.getElementById("allTaskList")
    allTaskList.innerHTML = ""
    for(let i=0;i<response.data.message.length;i++){
        allTaskList.innerHTML = `<p> ${response.data.message[i].tasks} </p>`
    }
    console.log(response)
}

function newUser(){
    let signUpPage = document.getElementById("signUpPage")
    signUpPage.style.display = "block"
    let signInPage = document.getElementById("signIn")
    signInPage.style.display = "none"
}
function accountExist(){
    let signUpPage = document.getElementById("signUpPage")
    signUpPage.style.display = "none"
    let signInPage = document.getElementById("signIn")
    signInPage.style.display = "block"
}

async function messageBox(message , Boolen){
    let messageBox = document.querySelector(".message-box")
    if(Boolen == true){
        messageBox.innerHTML = `<i class="fa-solid fa-check" style="margin-right: 10px; color: rgb(0, 255, 0);"></i> <span> ${message} <span>`
    }
    if(Boolen == false){
        messageBox.innerHTML = `<i class="fa-solid fa-xmark" style="margin-right: 10px; color: red;"></i> <span> ${message} <span>`
    }
    messageBox.classList.add("show")
    await setTimeout (function (){
        messageBox.classList.remove("show")
    },3000)
}
