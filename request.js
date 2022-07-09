async function postData(url="", data={}){

    const response = await fetch(url, {
        method: "POST",
        mode:"cors",
        cache:"no-cache",
        credentials:"same-origin",
        headers:{
         "content-type":"application/json",
        },
         redirect:"follow",
         referrerPolicy:"no-referrer",
         body:JSON.stringify(data),
        });

    return response.json();
}


//postData("http://localhost:3000/users", {
//    firstName:"Sage",
//    lastName:"Adesina",
//    phone:"310.777.8832",
//    tosAgreement:true,
//    password:"@Test0test"
//}).then(console.log).catch(console.log);

async function getUser(url="", data={}){
    const response = await fetch(url, {
        method:"GET",
        mode:"cors",
        cache:"no-cache",
        credentials:"same-origin",
        headers:{
            "content-type":"application/json",
        },
        redirect:"follow",
        referrerPolicy:"no-referrer",
    });

    return response.json();
}

//getData("http://localhost:3000/users?phone=310.777.8832", {
//}).then(console.log).catch(console.log);

async function updateUser(url="", data={}){
    const response = await fetch(url, {
        method:"PUT",
        mode:"cors",
        cache:"no-cache",
        credentials:"same-origin",
        headers:{
            "content-type":"application/json",
        },
        redirect:"follow",
        referrerpolicy:"no-referrer",
        body:JSON.stringify(data),
    });

    return response.json();
}

//updateUser("http://localhost:3000/users", {phone:"310.777.8832", firstName:"Des", lastName:"Desmond"
//}).then(console.log).catch(console.log);

async function deleteUser(url="", data={}){
    const response = await fetch(url, {
        method:"DELETE",
        mode:"cors",
        cache:"no-cache",
        credentials:"same-origin",
        headers:{
            "content-type":"application/json",
        },
        redirect:"follow",
        referrerpolicy:"no-referrer",
        body:JSON.stringify(data),
    });

    return response.json();
}

deleteUser("http://localhost:3000/users", {phone:"310.777.8832"
}).then(console.log).catch(console.log);
