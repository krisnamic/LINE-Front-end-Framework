var totalMakanan = 0;
var totalMinuman = 0;
var totalHarga = 0;

$(document).ready(function(){
    $(".jumlah").html("0");
    $(".min").click(function(){
        var i = $(this).siblings().closest(".jumlah").text();
        if(i>0){
            i--;
            $(this).siblings().closest(".jumlah").text(i);
            totalMakanan = parseInt($('.jumlahMakanan1').text()) + parseInt($('.jumlahMakanan2').text());
            totalMinuman = parseInt($('.jumlahMinuman1').text()) + parseInt($('.jumlahMinuman2').text());
            $('.totalJumlah').text('Total: '+totalMakanan+' makanan dan '+totalMinuman+' minuman');
            totalHarga = parseInt($('.jumlahMakanan1').text())*parseInt($('.harga1').text()) + parseInt($('.jumlahMakanan2').text())*parseInt($('.harga2').text()) + parseInt($('.jumlahMinuman1').text())*parseInt($('.harga3').text()) + parseInt($('.jumlahMinuman2').text())*parseInt($('.harga4').text());
            $('.totalHarga').text('Harga: '+totalHarga);
        }
    });
    $(".add").click(function(){
        var i = $(this).siblings().closest(".jumlah").text();
        i++
        $(this).siblings().closest(".jumlah").text(i);
        totalMakanan = parseInt($('.jumlahMakanan1').text()) + parseInt($('.jumlahMakanan2').text());
        totalMinuman = parseInt($('.jumlahMinuman1').text()) + parseInt($('.jumlahMinuman2').text());
        $('.totalJumlah').text('Total: '+totalMakanan+' makanan dan '+totalMinuman+' minuman');
        totalHarga = parseInt($('.jumlahMakanan1').text())*parseInt($('.harga1').text()) + parseInt($('.jumlahMakanan2').text())*parseInt($('.harga2').text()) + parseInt($('.jumlahMinuman1').text())*parseInt($('.harga3').text()) + parseInt($('.jumlahMinuman2').text())*parseInt($('.harga4').text());
        $('.totalHarga').text('Harga: '+totalHarga);
    });

    window.onload = function() {
        const useNodeJS = false;   // if you are not using a node server, set this value to false
        const defaultLiffId = "1655338109-RpZmDMGN";   // change the default LIFF value if you are not using a node server

        // DO NOT CHANGE THIS
        let myLiffId = "";

        // if node is used, fetch the environment variable and pass it to the LIFF method
        // otherwise, pass defaultLiffId
        myLiffId = defaultLiffId;
        initializeLiff(myLiffId);
    };



    /**
    * Initialize LIFF
    * @param {string} myLiffId The LIFF ID of the selected element
    */
    function initializeLiff(myLiffId) {
        liff
            .init({
                liffId: myLiffId
            })
            .then(() => {
                // start to use LIFF's api
                initializeApp();
            });
    }

    /**
     * Initialize the app by calling functions handling individual app components
     */
    function initializeApp() {
        displayIsInClientInfo();
        registerButtonHandlers();

        // check if the user is logged in/out, and disable inappropriate button
        if (liff.isLoggedIn()) {
            document.getElementById('liffLoginButton').disabled = false;
        } else {
            document.getElementById('liffLogoutButton').disabled = true;
        }
    }

    /**
    * Toggle the login/logout buttons based on the isInClient status, and display a message accordingly
    */
    function displayIsInClientInfo() {

        if (liff.isInClient()) {
            document.getElementById('liffLogoutButton').classList.add('hidden');
            toggleElement('liffLogoutButton');
        } else {
            document.getElementById('halamanLogin').classList.add('hidden');
            document.getElementById('isiAplikasi').classList.remove('hidden');
            toggleElement('halamanLogin');
            toggleElement('isiAplikasi');
            document.getElementById('liffLogoutButton').classList.remove('hidden');
            toggleElement('liffLogoutButton');
            document.getElementById('openWindowButton').classList.add('hidden');
        }
    }

    /**
    * Register event handlers for the buttons displayed in the app
    */
    function registerButtonHandlers() {

        // get profile call
        liff.getProfile().then(function(profile) {
            document.getElementById('displayNameField').textContent = profile.displayName;

            const profilePictureDiv = document.getElementById('profilePictureDiv');
            if (profilePictureDiv.firstElementChild) {
                profilePictureDiv.removeChild(profilePictureDiv.firstElementChild);
            }
            const img = document.createElement('img');
            img.src = profile.pictureUrl;
            img.alt = 'Profile Picture';
            profilePictureDiv.appendChild(img);
        });

        // openWindow call
        document.getElementById('openWindowButton').addEventListener('click', function() {
            liff.openWindow({
                url: 'https://submissionpemesananmakanan.herokuapp.com/',
                external: true
            });
        });

        // sendMessages call
        document.getElementById('sendMessageButton').addEventListener('click', function() {
            liff.sendMessages([{
                'type': 'text',
                'text': "Hi"+profile.displayName+",\n\nTerimakasih telah memesan makanan, berikut adalah review pesanannya:\n\n* "+totalMakanan+" Makanan\n* "+totalMinuman+" Minuman\n\nPesanan kakak akan segera diproses dan akan dibertahu jika sudah bisa diambil.\n\nMohon ditunggu ya!"
            }]).then(function() {
                window.alert('Message sent');
            });
        });

        // login call, only when external browser is used
        document.getElementById('liffLoginButton').addEventListener('click', function() {
            if (!liff.isLoggedIn()) {
                // set `redirectUri` to redirect the user to a URL other than the front page of your LIFF app.
                liff.login(); 
            }
            else{
                document.getElementById('halamanLogin').classList.remove('hidden');
                document.getElementById('isiAplikasi').classList.add('hidden');
                toggleElement('halamanLogin');
                toggleElement('isiAplikasi');
            }
        });

        // logout call only when external browse
        document.getElementById('liffLogoutButton').addEventListener('click', function() {
            if (liff.isLoggedIn()) {
                liff.logout();
                window.location.reload();
                document.getElementById('halamanLogin').classList.remove('hidden');
                document.getElementById('isiAplikasi').classList.add('hidden');
                toggleElement('halamanLogin');
                toggleElement('isiAplikasi');
            }
        });
    }

    /**
    * Toggle specified element
    * @param {string} elementId The ID of the selected element
    */
    function toggleElement(elementId) {
        const elem = document.getElementById(elementId);
        if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
            elem.style.display = 'none';
        } else {
            elem.style.display = 'block';
        }
    }

});
