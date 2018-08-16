function getHome() {
    const version_d = document.getElementById("show_result");
    version_d.innerHTML = "<h1>Welcome to the Department of Computer Science</h1><p>Welcome to New Zealand's leading computer science department. We pride ourselves on the excellence of our staff and our students.</p>";
}

function getCourses() {
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
                            '<a onclick="getTimetable(' + courseNum + ')">Timetable</a>' +
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
            for (let i = 0; i < timetableData.length; i++) {
                htmlToInsert += timetableData[i].component + '<br/>';
                for (let j = 0; j < timetableData[i].meetingPatterns.length; j++) {
                    htmlToInsert += timetableData[i].meetingPatterns[j].daysOfWeek +
                                    timetableData[i].meetingPatterns[j].location +
                                    timetableData[i].meetingPatterns[j].startTime +
                                    timetableData[i].meetingPatterns[j].endTime + '<br/>';
                }
            version_d.innerHTML = htmlToInsert;
            }
        }
        xhr.send(null);
    } else {
        version_d.innerHTML = '';
    }
}

function getPeople() { 
    const xhr = new XMLHttpRequest(); 
    const uri = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/people"; 
    xhr.open("GET", uri, true); 
    xhr.onload = () => { 
        const peopleData = JSON.parse(xhr.responseText).list;
        const version_d = document.getElementById("show_result");
        let htmlToInsert = '<h1>People</h1>'; 
        for (let i = 0; i < peopleData.length; i++) {
            const uid = peopleData[i].profileUrl[1];
            htmlToInsert += '<div class="people">' + peopleData[i].firstname + " " + peopleData[i].lastname + 
                            '<br/>Alt name: <span id="' + uid + 'altname"></span>' +
                            '<br/>Email: ' + ('<a href="mailto:' + peopleData[i].emailAddresses + '">' + peopleData[i].emailAddresses + '</a>') +
                            '<br/>Phone: <span id="' + uid + 'phone"></span>' +
                            '<br/><a href="http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/vcard?u=' + uid + '">vCard</a>' + (
                                (peopleData[i].hasOwnProperty('imageId')) ? 
                                ('<img src="https://unidirectory.auckland.ac.nz/people/imageraw/' + uid + '/' + peopleData[i].imageId + '/small">') :
                                ('<div class="filler-img"></div>')
                            ) + '</div>';
        }
        version_d.innerHTML = htmlToInsert;
        for (let i = 0; i < peopleData.length; i++) {
            const uid = peopleData[i].profileUrl[1];
            const phonexhr = new XMLHttpRequest();
            const phoneuri = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/person?u=" + uid;
            phonexhr.open("GET", phoneuri, true);
            phonexhr.onload = () => {
                const personData = JSON.parse(phonexhr.responseText);
                document.getElementById(uid+ "altname").innerHTML = personData.fullName;
                let phoneHtml;
                if (personData.phoneNumbers.length > 0) {
                    phoneHtml = ('<a href="tel:' + personData.phoneNumbers[0].phone + '">' + personData.phoneNumbers[0].phone + '</a>');
                } else {
                    phoneHtml = "n/a";
                }
                document.getElementById(uid+ "phone").innerHTML = phoneHtml;
            }
            phonexhr.send(null);
        }
        
    } 
    xhr.send(null);
}

function getNews() {
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

function getComments() {
    
}