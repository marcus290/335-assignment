function getPeople() { 
    const xhr = new XMLHttpRequest(); 
    const uri = "http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/people"; 
    xhr.open("GET", uri, true); 
    xhr.onload = () => { 
        const peopleData = JSON.parse(xhr.responseText).list;
        const version_d = document.getElementById("show_result");
        let htmlToInsert = ""; 
        for (let i = 0; i < peopleData.length; i++) {
            const uid = peopleData[i].profileUrl[1];
            htmlToInsert += '<div class="people">' + peopleData[i].firstname + " " + peopleData[i].lastname + 
                            '<br/>Alt name: <span id="' + uid + 'altname"></span>' +
                            '<br/>Email: ' + peopleData[i].emailAddresses +
                            '<br/>Phone: <span id="' + uid + 'phone"></span>' +
                            '<br/><a href="http://redsox.uoa.auckland.ac.nz/ups/UniProxService.svc/vcard?u='
                            + uid + '">vCard</a>' +  '</div>';
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