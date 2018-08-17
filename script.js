function getHome() {
    menuClose();
    const version_d = document.getElementById("show_result");
    version_d.innerHTML = "<h1>Welcome to the Department of Computer Science</h1><p>Welcome to New Zealand's leading computer science department. We pride ourselves on the excellence of our staff and our students.</p>";
}

function getCourses() {
    menuClose();
    const xhr = new XMLHttpRequest(); 
    const uri = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/courses"; 
    xhr.open("GET", uri, true); 
    xhr.onload = () => {
        const courseData = JSON.parse(xhr.responseText).data;
        const version_d = document.getElementById("show_result");
        let htmlToInsert = '<h1>Courses</h1>';
        let courseList = [];
        courseData.forEach((course) => courseList.push(course.catalogNbr));
        courseList.sort();
        courseList.forEach((courseNum) => {
            htmlToInsert += '<div class="courses"><h2>COMPSCI ' + courseNum + '</h2>' +
                            '<h3 id="' + courseNum + 'title"></h3>' +
                            '<p id="' + courseNum + 'des"></p>' +
                            '<a class="timetable" onclick="getTimetable(\'' + courseNum + '\')">Current course timetable</a>' +
                            '<div class="timetable" id="' + courseNum + 'timetable"></div>' +'</div>'; 
        });
        version_d.innerHTML = htmlToInsert;
        for (let i = 0; i < courseData.length; i++) {
            const courseTitle = document.getElementById(courseData[i].catalogNbr + "title");
            const courseInfo = document.getElementById(courseData[i].catalogNbr + "des");
            courseTitle.innerHTML = courseData[i].titleLong; 
            courseInfo.innerHTML =  courseData[i].hasOwnProperty('description') ? courseData[i].description : "";
        }
        
    }
    xhr.send(null);
}

function getTimetable(catalogNumber) {
    const version_d = document.getElementById(catalogNumber + "timetable");
    if (version_d.innerHTML === '') {  
        const xhr = new XMLHttpRequest(); 
        const uri = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/course?c=" + catalogNumber; 
        xhr.open("GET", uri, true); 
        xhr.onload = () => {
            const timetableData = JSON.parse(xhr.responseText).data;
            const version_d = document.getElementById(catalogNumber + "timetable");
            let htmlToInsert = '';
            const today = new Date();
            for (let i = 0; i < timetableData.length; i++) {
                let periodSD = new Date(timetableData[i].startDate);
                let periodED = new Date(timetableData[i].endDate);
                if (today < periodSD || today > periodED) {continue;}
                htmlToInsert += '<br/>' + timetableData[i].component + '<br/>';
                for (let j = 0; j < timetableData[i].meetingPatterns.length; j++) {
                    let startDate = new Date(timetableData[i].meetingPatterns[j].startDate);
                    let endDate = new Date(timetableData[i].meetingPatterns[j].endDate);
                    if (today < startDate || today > endDate) {continue;}

                    htmlToInsert += timetableData[i].meetingPatterns[j].daysOfWeek.replace(/^\w/, ch => ch.toUpperCase()) + ' ' +
                                    (timetableData[i].meetingPatterns[j].startTime.slice(0, 5)) + '-' +
                                    (timetableData[i].meetingPatterns[j].endTime.slice(0, 5)) + 
                                    ' Location: ' + timetableData[i].meetingPatterns[j].location +
                                    '<br/>';
                }
            }
            if (htmlToInsert === '') {htmlToInsert = "No classes scheduled currently";}
            version_d.innerHTML = htmlToInsert;
            
        }
        xhr.send(null);
    } else {
        version_d.innerHTML = '';
    }
}

function getPeople() { 
    menuClose();
    const xhr = new XMLHttpRequest(); 
    const uri = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/people"; 
    xhr.open("GET", uri, true); 
    xhr.onload = () => { 
        const peopleData = JSON.parse(xhr.responseText).list;
        const version_d = document.getElementById("show_result");
        let htmlToInsert = '<h1>People</h1>'; 
        for (let i = 0; i < peopleData.length; i++) {
            const uid = peopleData[i].profileUrl[1];
            htmlToInsert += '<div class="people">' + (
                                (peopleData[i].hasOwnProperty('imageId')) ? 
                                ('<img class="profile" src="https://unidirectory.auckland.ac.nz/people/imageraw/' + uid + '/' + peopleData[i].imageId + '/small">') :
                                ('<div class="profile-filler"></div>')
                            ) + '<span class="pname">' + peopleData[i].firstname + " " + peopleData[i].lastname + '</span>' +
                            '<br/>' + peopleData[i].jobtitles[0] +
                            '<br/>Email: ' + ('<a href="mailto:' + peopleData[i].emailAddresses + '">' + peopleData[i].emailAddresses + '</a>') +
                            '<br/>Phone: <span id="' + uid + 'phone"></span>' +
                            '<br/><a href="http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/vcard?u=' + uid + '">vCard</a>' + '</div>';
        }
        version_d.innerHTML = htmlToInsert;
        for (let i = 0; i < peopleData.length; i++) {
            const uid = peopleData[i].profileUrl[1];
            const phonexhr = new XMLHttpRequest();
            const phoneuri = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/person?u=" + uid;
            phonexhr.open("GET", phoneuri, true);
            phonexhr.onload = () => {
                const personData = JSON.parse(phonexhr.responseText);
                let phoneHtml;
                if (personData.phoneNumbers.length > 0) {
                    phoneHtml = ('<a href="tel:' + personData.phoneNumbers[0].phone + '">' + personData.phoneNumbers[0].phone + '</a>');
                } else {
                    phoneHtml = "n/a";
                }
                document.getElementById(uid + "phone").innerHTML = phoneHtml;
            }
            phonexhr.send(null);
        }
        
    } 
    xhr.send(null);
}

function getNews() {
    menuClose();
    const xhr = new XMLHttpRequest(); 
    const uri = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/news"; 
    xhr.open("GET", uri, true);
    xhr.setRequestHeader("Accept","application/json"); 
    xhr.onload = () => {
        const version_d = document.getElementById("show_result");
        const news = JSON.parse(xhr.responseText);
        let htmlToInsert = '<h1>News</h1>';
        for (let i = 0; i < news.length; i++) {
            htmlToInsert += '<div class="news-item"><a href="' + news[i].linkField + '"><h2>' + 
                            news[i].titleField + '</h2></a><h4>' + news[i].pubDateField + '</h4><p>' +
                            news[i].descriptionField + '</p></div>';
        } 
        version_d.innerHTML = htmlToInsert;
    } 
    xhr.send(null);
}

function getNotices() {
    menuClose();
    const xhr = new XMLHttpRequest(); 
    const uri = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/notices"; 
    xhr.open("GET", uri, true);
    xhr.setRequestHeader("Accept","application/json"); 
    xhr.onload = () => {
        const version_d = document.getElementById("show_result");
        const notices = JSON.parse(xhr.responseText);
        let htmlToInsert = '<h1>Notices</h1>';
        for (let i = 0; i < notices.length; i++) {
            htmlToInsert += '<div class="notices-item"><a href="' + notices[i].linkField + '"><h2>' + 
                            notices[i].titleField + '</h2></a><h4>' + notices[i].pubDateField + '</h4><p>' +
                            notices[i].descriptionField + '</p></div>';
        } 
        version_d.innerHTML = htmlToInsert;
    } 
    xhr.send(null);
}

function postComments(form) {
    const formEle = form.elements;
    //console.log(formEle.name.value, formEle.message.value);
    const xhr = new XMLHttpRequest(); 
    const uri = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/comment?name=" + form.elements.name.value; 
    xhr.open("POST", uri, true); 
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8"); 
    xhr.onload = () => { 
        getComments();
    }
    let objectToPost = form.elements.message.value;
    xhr.send(JSON.stringify(objectToPost));
}
function getComments() {
    menuClose();
    const xhr = new XMLHttpRequest(); 
    const uri = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/htmlcomments"; 
    xhr.open("GET", uri, true);
    xhr.onload = () => {
        const version_d = document.getElementById("show_result");
        let htmlToInsert = '<form id="myForm"><textarea name="message" rows="4" cols="50" placeholder="Comment"></textarea><br/>' + 
                        '<label for="commentName">Name:</label><input id="myName" name="name"><input type="submit" value="Submit"></form>' +
                        '<div id="messageSent"></div>';
        version_d.innerHTML = htmlToInsert + xhr.responseText;
        const form = document.getElementById("myForm");
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            postComments(form);
        });
    } 
    xhr.send(null);
}

function menuOpen() {
    document.getElementById("menu").style.height = "auto";
    document.getElementById("menuButton").setAttribute('onclick', "menuClose()");
}
function menuClose() {
    document.getElementById("menu").style.height = "0";
    document.getElementById("menuButton").setAttribute('onclick', "menuOpen()");
}
