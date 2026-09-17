/* lgin page*/

function login() {

    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let errorMessage = document.querySelector("#error-message");

    if (username == "admin" && password == "1234") {

        localStorage.setItem("accessLevel", "admin");
        window.location.href = "dashboard.html";

    } else if (checkTeacherLogin(username, password)) {

        localStorage.setItem("accessLevel", "teacher");
        window.location.href = "attendance.html";

    } else if (checkParentLogin(username, password)) {

        localStorage.setItem("accessLevel", "parent");
        localStorage.setItem("studentId", password);
        window.location.href = "student.html";

    } else {

        errorMessage.innerHTML = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";

    }
}

function checkTeacherLogin(username, password) {

    let teachers = JSON.parse(localStorage.getItem("teachers")) || [];

    for (let i = 0; i < teachers.length; i++) {

        if (teachers[i].username == username &&
            teachers[i].password == password) {

            return true;
        }
    }

    return false;
}

function checkParentLogin(username, password) {

    let classes = JSON.parse(localStorage.getItem("classes")) || [];


    for (let i = 0; i < classes.length; i++) {

        for (let j = 0; j < classes[i].students.length; j++) {

            let student = classes[i].students[j];


            if (student.firstname.trim() == username.trim() &&
                student.id.trim() == password.trim()) {

                return true;
            }
        }
    }

    return false;
}

/* attendance */
function saveAttendance() {
    let classIndex = document.querySelector("#class-select").value;
    let period = document.querySelector("#period-select").value;
    let students = classes[classIndex].students;
    let statuses = document.querySelectorAll(".status");

    let now = new Date();
    let today = now.toLocaleDateString("th-TH");
    let time = now.getHours().toString().padStart(2, "0") + ":" +
        now.getMinutes().toString().padStart(2, "0") + " น.";

    for (let i = 0; i < students.length; i++) {

        students[i].attendance = students[i].attendance || [];

        let found = false;

        for (let j = 0; j < students[i].attendance.length; j++) {

            if (students[i].attendance[j].date == today &&
                students[i].attendance[j].period == period) {

                students[i].attendance[j].status = statuses[i].value;
                students[i].attendance[j].time = time;

                found = true;
            }
        }

        if (found == false) {

            students[i].attendance.push({
                date: today,
                time: time,
                period: period,
                status: statuses[i].value
            });

        }
    }

    localStorage.setItem("classes", JSON.stringify(classes));

    document.querySelector("#save-message").innerHTML =
        "บันทึกการเช็กชื่อเรียบร้อยแล้ว";
}

window.onload = function () {

    let todayDate = document.querySelector("#today-date");

    if (todayDate != null) {

        let date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear() + 543;

        todayDate.innerHTML =
            "วันที่ " + day + "/" + month + "/" + year;
    }
};

/* Teacher Account Management */

let teachers = JSON.parse(localStorage.getItem("teachers")) || [];

function toggleAddTeacherForm() {

    document.querySelector("#teacher-message").innerHTML = "";
    document.querySelector("#add-teacher-modal").style.display = "flex";

}

function closeAddTeacherForm() {

    document.querySelector("#add-teacher-modal").style.display = "none";
    document.querySelector("#teacher-message").innerHTML = "";

}

function addTeacher() {

    let firstname = document.querySelector("#teacher-firstname").value;
    let lastname = document.querySelector("#teacher-lastname").value;
    let username = document.querySelector("#teacher-username").value;
    let password = document.querySelector("#teacher-password").value;
    let message = document.querySelector("#teacher-message");

    if (firstname == "" || lastname == "" || username == "" || password == "") {
        message.innerHTML = "กรุณากรอกข้อมูลให้ครบ";
        return;
    }

    for (let i = 0; i < teachers.length; i++) {

        if (teachers[i].username == username) {

            message.innerHTML = "Username นี้มีอยู่แล้ว";
            return;
        }
    }

    teachers.push({
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: password
    });

    localStorage.setItem("teachers", JSON.stringify(teachers));

    document.querySelector("#teacher-firstname").value = "";
    document.querySelector("#teacher-lastname").value = "";
    document.querySelector("#teacher-username").value = "";
    document.querySelector("#teacher-password").value = "";

    message.innerHTML = "เพิ่มบัญชีครูเรียบร้อยแล้ว";

    showTeachers();
    closeAddTeacherForm();
}

function showTeachers() {

    let list = document.querySelector("#teacher-list");

    if (list == null) {
        return;
    }

    list.innerHTML = "";

    for (let i = 0; i < teachers.length; i++) {

        list.innerHTML +=
            "<tr>" +
            "<td>" + teachers[i].firstname + " " + teachers[i].lastname + "</td>" +
            "<td>" + teachers[i].username + "</td>" +
            "<td>" +
            "<span id='password-" + i + "'>••••••••</span>" +
            "<button class='reveal-button' onclick='revealPassword(" + i + ")'>แสดงรหัสผ่าน</button>" +
            "</td>" +
            "<td>" +
            "<button class='teacher-edit-button' onclick='editTeacher(" + i + ")'>แก้ไข</button>" +
            "<button class='delete-button' onclick='deleteTeacher(" + i + ")'>ลบบัญชี</button>" +
            "</td>" +
            "</tr>";
    }


}

let editingTeacherIndex = -1;

function editTeacher(index) {

    editingTeacherIndex = index;

    document.querySelector("#edit-teacher-firstname").value =
        teachers[index].firstname;

    document.querySelector("#edit-teacher-lastname").value =
        teachers[index].lastname;

    document.querySelector("#edit-teacher-username").value =
        teachers[index].username;

    document.querySelector("#edit-teacher-password").value =
        teachers[index].password;

    document.querySelector("#edit-teacher-modal").style.display = "flex";
}

function closeEditTeacher() {

    document.querySelector("#edit-teacher-modal").style.display = "none";

    editingTeacherIndex = -1;
}

function saveEditedTeacher() {

    let firstname =
        document.querySelector("#edit-teacher-firstname").value.trim();

    let lastname =
        document.querySelector("#edit-teacher-lastname").value.trim();

    let username =
        document.querySelector("#edit-teacher-username").value.trim();

    let password =
        document.querySelector("#edit-teacher-password").value.trim();

    if (firstname == "" ||
        lastname == "" ||
        username == "" ||
        password == "") {

        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
    }

    for (let i = 0; i < teachers.length; i++) {

        if (i != editingTeacherIndex &&
            teachers[i].username == username) {

            alert("Username นี้มีอยู่แล้ว");
            return;
        }
    }

    teachers[editingTeacherIndex].firstname = firstname;
    teachers[editingTeacherIndex].lastname = lastname;
    teachers[editingTeacherIndex].username = username;
    teachers[editingTeacherIndex].password = password;

    localStorage.setItem("teachers", JSON.stringify(teachers));

    closeEditTeacher();

    showTeachers();
}

function revealPassword(index) {

    let password = document.querySelector("#password-" + index);
    let button = password.nextElementSibling;

    if (password.innerHTML == "••••••••") {
        password.innerHTML = teachers[index].password;
        button.innerHTML = "ซ่อนรหัสผ่าน";
    }
    else {
        password.innerHTML = "••••••••";
        button.innerHTML = "แสดงรหัสผ่าน";
    }

}

function deleteTeacher(index) {

    teachers.splice(index, 1);

    localStorage.setItem("teachers", JSON.stringify(teachers));

    showTeachers();
}

if (document.querySelector("#teacher-list")) {
    showTeachers();
}

/* Class Management */

let classes = JSON.parse(localStorage.getItem("classes")) || [];

function addClass() {

    let className = document.querySelector("#class-name").value;
    let message = document.querySelector("#class-message");

    if (className == "") {
        message.innerHTML = "กรุณาใส่ชื่อห้องเรียน";
        return;
    }

    classes.push({
        name: className,
        students: []
    });

    localStorage.setItem("classes", JSON.stringify(classes));

    document.querySelector("#class-name").value = "";

    message.innerHTML = "สร้างห้องเรียนเรียบร้อยแล้ว";

    showClasses();
}

function showClasses() {

    let list = document.querySelector("#class-list");

    if (list == null) {
        return;
    }

    list.innerHTML = "";

    for (let i = 0; i < classes.length; i++) {

        list.innerHTML +=
            "<div class='class-item'>" +

            "<div>" +
            "<h3>" + classes[i].name + "</h3>" +
            "<p>" + classes[i].students.length + " คน</p>" +
            "</div>" +

            "<div class='class-buttons'>" +

            "<button onclick='openClass(" + i + ")'>" +
            "จัดการนักเรียน" +
            "</button>" +

            "<button class='class-edit-button' " +
            "onclick='editClassName(" + i + ")'>" +
            "แก้ไขชื่อ" +
            "</button>" +

            "</div>" +

            "</div>";
    }
}

function openClass(index) {

    localStorage.setItem("selectedClass", index);

    window.location.href = "class.html";
}


let editingClassIndex = -1;


function editClassName(index) {

    editingClassIndex = index;

    document.querySelector("#edit-class-name").value =
        classes[index].name;

    document.querySelector("#edit-class-modal").style.display = "flex";
}


function closeEditClass() {

    document.querySelector("#edit-class-modal").style.display = "none";

    editingClassIndex = -1;
}


function saveEditedClass() {

    let newName =
        document.querySelector("#edit-class-name").value.trim();

    if (newName == "") {

        alert("กรุณาใส่ชื่อห้องเรียน");
        return;
    }

    classes[editingClassIndex].name = newName;

    localStorage.setItem("classes", JSON.stringify(classes));

    closeEditClass();

    showClasses();
}

/* Class Student Management */

function addStudent() {

    let studentId = document.querySelector("#student-id").value;
    let studentNumber = document.querySelector("#student-number").value;
    let firstname = document.querySelector("#student-firstname").value;
    let lastname = document.querySelector("#student-lastname").value;
    let message = document.querySelector("#student-message");

    if (studentId == "" ||
        studentNumber == "" ||
        firstname == "" ||
        lastname == "") {

        message.innerHTML = "กรุณากรอกข้อมูลให้ครบ";
        return;
    }

    let classIndex = localStorage.getItem("selectedClass");

    for (let i = 0; i < classes[classIndex].students.length; i++) {

        if (classes[classIndex].students[i].id == studentId) {

            message.innerHTML = "รหัสนักเรียนนี้มีอยู่แล้ว";
            return;
        }
    }

    classes[classIndex].students.push({
        id: studentId,
        number: studentNumber,
        firstname: firstname,
        lastname: lastname
    });

    localStorage.setItem("classes", JSON.stringify(classes));

    document.querySelector("#student-id").value = "";
    document.querySelector("#student-number").value = "";
    document.querySelector("#student-firstname").value = "";
    document.querySelector("#student-lastname").value = "";

    message.innerHTML = "เพิ่มนักเรียนเรียบร้อยแล้ว";

    showStudents();
}

function showStudents() {

    let list = document.querySelector("#student-list");

    if (list == null) {
        return;
    }

    let classIndex = localStorage.getItem("selectedClass");

    if (classIndex == null || classes[classIndex] == null) {
        return;
    }

    document.querySelector("#selected-class-name").innerHTML =
        "จัดการนักเรียน - " + classes[classIndex].name;

    let students = classes[classIndex].students.slice();

    let searchInput = document.querySelector("#student-search-input");
    let searchText = "";

    if (searchInput != null) {
        searchText = searchInput.value.toLowerCase().trim();
    }

    if (searchText != "") {

        students = students.filter(function (student) {

            let name =
                student.firstname + " " + student.lastname;

            return student.id.toLowerCase().includes(searchText) ||
                student.number.toLowerCase().includes(searchText) ||
                name.toLowerCase().includes(searchText);

        });
    }

    let sortType = "number";
    let sortSelect = document.querySelector("#student-sort");

    if (sortSelect != null) {
        sortType = sortSelect.value;
    }

    students.sort(function (a, b) {

        if (sortType == "number") {
            return Number(a.number) - Number(b.number);
        }

        if (sortType == "id") {
            return a.id.localeCompare(b.id);
        }

        if (sortType == "name") {
            let nameA = a.firstname + " " + a.lastname;
            let nameB = b.firstname + " " + b.lastname;

            return nameA.localeCompare(nameB);
        }

    });

    list.innerHTML = "";

    for (let i = 0; i < students.length; i++) {

        let student = students[i];

        let originalIndex =
            classes[classIndex].students.indexOf(student);

        let initials =
            (student.firstname.charAt(0) +
                student.lastname.charAt(0)).toUpperCase();

        list.innerHTML +=
            "<tr>" +

            "<td>" +
            "<span class='student-number-circle'>" +
            (i + 1) +
            "</span>" +
            "</td>" +

            "<td>" +
            student.id +
            "</td>" +

            "<td>" +
            student.number +
            "</td>" +

            "<td>" +
            "<div class='student-name-cell'>" +
            "<span class='student-initial'>" +
            initials +
            "</span>" +
            student.firstname + " " + student.lastname +
            "</div>" +
            "</td>" +

            "<td>" +
            "<div class='student-action-buttons'>" +

            "<button class='student-edit-button' " +
            "onclick='editStudent(" + originalIndex + ")'>" +
            "✎ แก้ไข" +
            "</button>" +

            "<button class='student-delete-button' " +
            "onclick='deleteStudent(" + originalIndex + ")'>" +
            "▢ ลบนักเรียน" +
            "</button>" +

            "</div>" +
            "</td>" +

            "</tr>";
    }

    let total = document.querySelector("#student-total");

    if (total != null) {
        total.innerHTML =
            "ทั้งหมด " + classes[classIndex].students.length + " คน";
    }
}

function toggleAddStudentForm() {

    let form = document.querySelector("#add-student-form");

    if (form.style.display == "block") {
        form.style.display = "none";
    }
    else {
        form.style.display = "block";
    }
}

function editStudent(index) {

    let classIndex = localStorage.getItem("selectedClass");
    let student = classes[classIndex].students[index];

    editingStudentIndex = index;

    document.querySelector("#edit-student-id").value = student.id;
    document.querySelector("#edit-student-number").value = student.number;
    document.querySelector("#edit-student-firstname").value = student.firstname;
    document.querySelector("#edit-student-lastname").value = student.lastname;

    document.querySelector("#edit-student-modal").style.display = "flex";
}


function closeEditStudent() {

    document.querySelector("#edit-student-modal").style.display = "none";

    editingStudentIndex = -1;
}


function saveEditedStudent() {

    let classIndex = localStorage.getItem("selectedClass");
    let student = classes[classIndex].students[editingStudentIndex];

    let newId = document.querySelector("#edit-student-id").value;
    let newNumber = document.querySelector("#edit-student-number").value;
    let newFirstname = document.querySelector("#edit-student-firstname").value;
    let newLastname = document.querySelector("#edit-student-lastname").value;

    if (newId == "" ||
        newNumber == "" ||
        newFirstname == "" ||
        newLastname == "") {

        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
    }

    for (let i = 0; i < classes[classIndex].students.length; i++) {

        if (i != editingStudentIndex &&
            classes[classIndex].students[i].id == newId) {

            alert("รหัสนักเรียนนี้มีอยู่แล้ว");
            return;
        }
    }

    student.id = newId;
    student.number = newNumber;
    student.firstname = newFirstname;
    student.lastname = newLastname;

    localStorage.setItem("classes", JSON.stringify(classes));

    closeEditStudent();

    showStudents();
}

function deleteStudent(index) {

    let classIndex = localStorage.getItem("selectedClass");

    classes[classIndex].students.splice(index, 1);

    localStorage.setItem("classes", JSON.stringify(classes));

    showStudents();
}

if (document.querySelector("#student-list")) {
    showStudents();
}

if (document.querySelector("#class-list")) {
    showClasses();
}

function showAttendanceClasses() {

    let select = document.querySelector("#class-select");

    if (select == null) {
        return;
    }

    select.innerHTML = "";

    for (let i = 0; i < classes.length; i++) {

        select.innerHTML +=
            "<option value='" + i + "'>" + classes[i].name + "</option>";
    }

    document.querySelector("#class-select").onchange = showAttendanceStudents;
    showPeriods();
    document.querySelector("#period-select").onchange = showAttendanceStudents;

    showAttendanceStudents();
}

if (document.querySelector("#class-select")) {
    showAttendanceClasses();
}
function getAttendanceStatus(student, period) {
    let today = new Date().toLocaleDateString("th-TH");

    if (student.attendance) {
        for (let i = 0; i < student.attendance.length; i++) {
            if (student.attendance[i].date == today &&
                student.attendance[i].period == period) {
                return student.attendance[i].status;
            }
        }
    }

    return "present";
}

function showAttendanceStudents() {

    let list = document.querySelector("#attendance-list");

    if (list == null) {
        return;
    }

    let classIndex = document.querySelector("#class-select").value;

    let period = document.querySelector("#period-select").value;

    list.innerHTML = "";

    if (classes[classIndex] == null) {
        return;
    }

    for (let i = 0; i < classes[classIndex].students.length; i++) {

        let student = classes[classIndex].students[i];

        list.innerHTML +=
            "<tr>" +
            "<td>" + student.id + "</td>" +
            "<td>" + student.firstname + " " + student.lastname + "</td>" +
            "<td>" +
            "<select class='status'>" +
            "<option value='present' " + (getAttendanceStatus(student, period) == "present" ? "selected" : "") + ">มาเรียน</option>" +
            "<option value='absent' " + (getAttendanceStatus(student, period) == "absent" ? "selected" : "") + ">ขาดเรียน</option>" +
            "<option value='late' " + (getAttendanceStatus(student, period) == "late" ? "selected" : "") + ">มาสาย</option>" +
            "<option value='leave' " + (getAttendanceStatus(student, period) == "leave" ? "selected" : "") + ">ลา</option>" +
            "</select>" +
            "</td>" +
            "</tr>";
    }
}

if (document.querySelector("#attendance-list")) {
    showAttendanceStudents();
}

function getStatusText(status) {

    if (status == "present") {
        return "มาเรียน";
    }

    if (status == "absent") {
        return "ขาดเรียน";
    }

    if (status == "late") {
        return "มาสาย";
    }

    if (status == "leave") {
        return "ลา";
    }
}

function showNavbar() {

    let navbar = document.querySelector("#navbar");

    if (navbar == null) {
        return;
    }

    let accessLevel = localStorage.getItem("accessLevel");
    let currentPage = window.location.pathname.split("/").pop();

    let navbarHTML =
        "<header class='navbar'>" +
        "<div class='nav-title'>" +
        "<img src='images/maehoingenschoollogo.png'>" +
        "<span>โรงเรียนบ้านแม่ฮ้อยเงิน</span>" +
        "</div>" +
        "<div class='nav-links'>";

    if (accessLevel == "admin") {

        navbarHTML += "<a href='dashboard.html' " +
            (currentPage == "dashboard.html" ? "class='active'" : "") +
            ">หน้าหลัก</a>";

        navbarHTML += "<a href='attendance.html' " +
            (currentPage == "attendance.html" ? "class='active'" : "") +
            ">เช็กชื่อ</a>";

        navbarHTML += "<a href='student.html' " +
            (currentPage == "student.html" ? "class='active'" : "") +
            ">นักเรียน</a>";

        navbarHTML += "<a href='records.html' " +
            (currentPage == "records.html" ? "class='active'" : "") +
            ">การเข้าเรียน</a>";

        navbarHTML += "<a href='teachers.html' " +
            (currentPage == "teachers.html" ? "class='active'" : "") +
            ">จัดการครู</a>";

        navbarHTML += "<a href='classes.html' " +
            (currentPage == "classes.html" || currentPage == "class.html" ? "class='active'" : "") +
            ">จัดการห้องเรียน</a>";
    }

    else if (accessLevel == "teacher") {

        navbarHTML += "<a href='attendance.html' " +
            (currentPage == "attendance.html" ? "class='active'" : "") +
            ">เช็กชื่อ</a>";

        navbarHTML += "<a href='student.html' " +
            (currentPage == "student.html" ? "class='active'" : "") +
            ">นักเรียน</a>";

        navbarHTML += "<a href='records.html' " +
            (currentPage == "records.html" ? "class='active'" : "") +
            ">การเข้าเรียน</a>";
    }

    else if (accessLevel == "parent") {
        navbarHTML += "<a href='student.html' " +
            (currentPage == "student.html" ? "class='active'" : "") +
            ">นักเรียน</a>";
    }

    navbarHTML +=
        "<a href='#' onclick='logout()'>ออกจากระบบ</a>" +
        "</div>" +
        "</header>";

    navbar.innerHTML = navbarHTML;
}

if (document.querySelector("#navbar")) {
    showNavbar();
}

function logout() {
    localStorage.removeItem("accessLevel");
    window.location.href = "login.html";
}

function showStudentStatistics() {

    let studentId = localStorage.getItem("studentId");

    if (studentId == null) {
        return;
    }

    for (let i = 0; i < classes.length; i++) {

        for (let j = 0; j < classes[i].students.length; j++) {

            let student = classes[i].students[j];

            if (student.id == studentId) {

                let present = 0;
                let absent = 0;
                let late = 0;
                let leave = 0;

                let checkedDays = [];

                if (student.attendance) {

                    for (let k = 0; k < student.attendance.length; k++) {

                        let record = student.attendance[k];

                        if (Number(record.period) != 1) {
                            continue;
                        }

                        let parts = record.date.split("/");

                        if (parts.length != 3) {
                            continue;
                        }

                        let recordDate = new Date(
                            Number(parts[2]) - 543,
                            Number(parts[1]) - 1,
                            Number(parts[0])
                        );

                        if (recordDate.getDay() == 0 ||
                            recordDate.getDay() == 6) {
                            continue;
                        }

                        if (checkedDays.indexOf(record.date) == -1) {

                            checkedDays.push(record.date);

                            if (record.status == "present") {
                                present++;
                            }

                            if (record.status == "absent") {
                                absent++;
                            }

                            if (record.status == "late") {
                                late++;
                            }

                            if (record.status == "leave") {
                                leave++;
                            }
                        }
                    }
                }

                let total = present + absent + late + leave;
                let rate = 0;

                if (total > 0) {
                    rate = Math.round((present / total) * 100);
                }

                document.querySelector("#present-count").innerHTML = present;
                document.querySelector("#absent-count").innerHTML = absent;
                document.querySelector("#late-count").innerHTML = late;
                document.querySelector("#leave-count").innerHTML = leave;
                document.querySelector("#attendance-rate").innerHTML = rate + "%";

                document.querySelector("#total-attendance").innerHTML =
                    "คิดจากทั้งหมด " + total + " วัน";

                return;
            }
        }
    }
}

if (document.querySelector("#present-count")) {
    showStudentStatistics();
}

/* Student Profile */

function showStudentProfile() {

    let studentId = localStorage.getItem("studentId");
    let classes = JSON.parse(localStorage.getItem("classes")) || [];

    for (let i = 0; i < classes.length; i++) {

        for (let j = 0; j < classes[i].students.length; j++) {

            let student = classes[i].students[j];

            if (student.id.trim() == studentId.trim()) {

                document.querySelector("#student-name").innerHTML =
                    student.firstname + " " + student.lastname;

                document.querySelector("#student-id").innerHTML =
                    student.id;

                document.querySelector("#student-class").innerHTML =
                    classes[i].name;

                return;
            }
        }
    }
}

if (document.querySelector("#student-name")) {
    showStudentProfile();
}

/* Student Search */

function searchStudent() {

    let studentId = document.querySelector("#search-student-id").value.trim();
    let message = document.querySelector("#search-message");
    let classes = JSON.parse(localStorage.getItem("classes")) || [];

    if (studentId == "") {
        message.innerHTML = "กรุณากรอกรหัสนักเรียน";
        return;
    }

    for (let i = 0; i < classes.length; i++) {

        for (let j = 0; j < classes[i].students.length; j++) {

            let student = classes[i].students[j];

            if (student.id.trim() == studentId) {

                localStorage.setItem("studentId", student.id);

                showStudentProfile();

                message.innerHTML = "";

                return;
            }
        }
    }

    message.innerHTML = "ไม่พบนักเรียนรหัสนี้";
}

let searchBox = document.querySelector("#student-search");

if (searchBox != null) {

    let accessLevel = localStorage.getItem("accessLevel");

    if (accessLevel != "admin" && accessLevel != "teacher") {
        searchBox.style.display = "none";
    }
}

/* Student History */

function showStudentHistory() {

    let list = document.querySelector("#student-history-list");

    if (list == null) {
        return;
    }

    let studentId = localStorage.getItem("studentId");
    let savedClasses = JSON.parse(localStorage.getItem("classes")) || [];

    list.innerHTML = "";

    for (let i = 0; i < savedClasses.length; i++) {

        for (let j = 0; j < savedClasses[i].students.length; j++) {

            let student = savedClasses[i].students[j];

            if (student.id.trim() == studentId.trim()) {

                let attendance = student.attendance || [];

                for (let k = attendance.length - 1; k >= 0; k--) {

                    let status = getStatusText(attendance[k].status);

                    list.innerHTML +=
                        "<tr>" +
                        "<td>" + attendance[k].date + "</td>" +
                        "<td>" + (attendance[k].time || "-") + "</td>" +
                        "<td>" + status + "</td>" +
                        "</tr>";
                }

                return;
            }
        }
    }
}

if (document.querySelector("#student-history-list")) {
    showStudentHistory();
}

/* Attendance Notification */

function showAttendanceNotification() {

    let studentId = localStorage.getItem("studentId");
    let classes = JSON.parse(localStorage.getItem("classes")) || [];

    let notification = document.querySelector("#attendance-notification");
    let notificationTime = document.querySelector("#notification-time");

    if (notification == null) {
        return;
    }

    for (let i = 0; i < classes.length; i++) {

        for (let j = 0; j < classes[i].students.length; j++) {

            let student = classes[i].students[j];

            if (student.id.trim() == studentId.trim()) {

                let today = new Date().toLocaleDateString("th-TH");

                if (student.attendance) {

                    for (let k = 0; k < student.attendance.length; k++) {

                        if (student.attendance[k].date == today &&
                            Number(student.attendance[k].period) == 1) {

                            let status = getStatusText(student.attendance[k].status);

                            notification.innerHTML =
                                "วันนี้ " + student.firstname + " " +
                                student.lastname +
                                " ได้รับการเช็กชื่อว่า \"" + status + "\"";

                            notificationTime.innerHTML =
                                student.attendance[k].time || "";

                            return;
                        }
                    }
                }

                notification.innerHTML =
                    "วันนี้ยังไม่มีการเช็กชื่อ";

                notificationTime.innerHTML = "";

                return;
            }
        }
    }
}

if (document.querySelector("#attendance-notification")) {
    showAttendanceNotification();
}

/* Period Management */

function savePeriods() {

    let periodCount = document.querySelector("#period-count").value;
    let message = document.querySelector("#period-message");

    if (periodCount == "") {
        message.innerHTML = "กรุณาใส่จำนวนคาบเรียน";
        return;
    }

    localStorage.setItem("periodCount", periodCount);

    message.innerHTML = "บันทึกจำนวนคาบเรียนเรียบร้อยแล้ว";
}

function saveTermDates() {

    let term = document.querySelector("#term-select").value;
    let start = document.querySelector("#term-start").value;
    let end = document.querySelector("#term-end").value;
    let message = document.querySelector("#term-message");

    if (start == "" || end == "") {
        message.innerHTML = "กรุณาเลือกวันเริ่มและวันสิ้นสุด";
        return;
    }

    if (start > end) {
        message.innerHTML = "วันเริ่มต้องมาก่อนวันสิ้นสุด";
        return;
    }

    localStorage.setItem("term" + term + "Start", start);
    localStorage.setItem("term" + term + "End", end);

    message.innerHTML =
        "บันทึกข้อมูลภาคเรียนที่ " + term + " เรียบร้อยแล้ว";
}

function showTermDates() {

    let term = document.querySelector("#term-select").value;

    let start = localStorage.getItem("term" + term + "Start");
    let end = localStorage.getItem("term" + term + "End");

    document.querySelector("#term-start").value = start || "";
    document.querySelector("#term-end").value = end || "";
}

if (document.querySelector("#term-select")) {

    showTermDates();

    document.querySelector("#term-select").onchange = showTermDates;
}

/* Attendance Periods */

function showPeriods() {

    let select = document.querySelector("#period-select");

    if (select == null) {
        return;
    }

    let periodCount = Number(localStorage.getItem("periodCount")) || 8;

    select.innerHTML = "";

    for (let i = 1; i <= periodCount; i++) {

        select.innerHTML +=
            "<option value='" + i + "'>คาบที่ " + i + "</option>";
    }
}

function showRecordsPage() {

    let classSelect = document.querySelector("#record-class");
    let periodSelect = document.querySelector("#record-period");
    let content = document.querySelector("#records-content");

    if (classSelect == null || periodSelect == null || content == null) {
        return;
    }

    classSelect.innerHTML = "";

    for (let i = 0; i < classes.length; i++) {

        classSelect.innerHTML +=
            "<option value='" + i + "'>" +
            classes[i].name +
            "</option>";

    }

    classSelect.onchange = showRecordData;
    periodSelect.onchange = showRecordData;

    document.querySelector("#record-date").onchange = showRecordData;
    document.querySelector("#week-start").onchange = showRecordData;
    document.querySelector("#week-end").onchange = showRecordData;
    document.querySelector("#record-month").onchange = showRecordData;
    document.querySelector("#record-term").onchange = showRecordData;

    let now = new Date();

    let today =
        now.getFullYear() + "-" +
        (now.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        now.getDate().toString().padStart(2, "0");

    document.querySelector("#record-date").value = today;

    let month =
        now.getFullYear() + "-" +
        (now.getMonth() + 1).toString().padStart(2, "0");

    let monday = new Date(now);
    let dayOfWeek = monday.getDay();

    if (dayOfWeek == 0) {
        monday.setDate(monday.getDate() - 6);
    } else {
        monday.setDate(monday.getDate() - dayOfWeek + 1);
    }

    let sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    document.querySelector("#week-start").value =
        monday.getFullYear() + "-" +
        (monday.getMonth() + 1).toString().padStart(2, "0") + "-" +
        monday.getDate().toString().padStart(2, "0");

    document.querySelector("#week-end").value =
        sunday.getFullYear() + "-" +
        (sunday.getMonth() + 1).toString().padStart(2, "0") + "-" +
        sunday.getDate().toString().padStart(2, "0");

    showRecordData();
}


function showRecordData() {

    let classIndex = document.querySelector("#record-class").value;
    let recordType = document.querySelector("#record-period").value;

    let dailyDate = document.querySelector("#daily-date");
    let weekDate = document.querySelector("#week-date");
    let monthDate = document.querySelector("#month-date");
    let termDate = document.querySelector("#term-date");

    dailyDate.style.display = "none";
    weekDate.style.display = "none";
    monthDate.style.display = "none";
    termDate.style.display = "none";

    if (recordType == "daily") {

        dailyDate.style.display = "flex";

        showTodayRecords(classIndex);

    }

    if (recordType == "week") {

        weekDate.style.display = "flex";

        showWeekRecords(classIndex);

    }

    if (recordType == "month") {

        monthDate.style.display = "flex";

        showMonthRecords(classIndex);

    }

    if (recordType == "term") {

        termDate.style.display = "flex";

        showTermRecords(classIndex);

    }
}


function showTodayRecords(classIndex) {

    let content = document.querySelector("#records-content");

    let selectedDate = document.querySelector("#record-date").value;

    if (selectedDate == "") {
        let now = new Date();

        selectedDate =
            now.getFullYear() + "-" +
            (now.getMonth() + 1).toString().padStart(2, "0") + "-" +
            now.getDate().toString().padStart(2, "0");
    }

    let dateParts = selectedDate.split("-");

    let selectedDay = Number(dateParts[2]);
    let selectedMonth = Number(dateParts[1]);
    let selectedYear = Number(dateParts[0]) + 543;

    let selectedDate1 =
        selectedDay + "/" +
        selectedMonth + "/" +
        selectedYear;

    let selectedDate2 =
        selectedDay.toString().padStart(2, "0") + "/" +
        selectedMonth.toString().padStart(2, "0") + "/" +
        selectedYear;

    let periodCount = Number(localStorage.getItem("periodCount")) || 8;

    let html = "";

    for (let period = 1; period <= periodCount; period++) {

        html +=
            "<h2 class='record-period-title'>คาบที่ " + period + "</h2>" +
            "<table class='records-table'>" +
            "<tr>" +
            "<th>รหัสนักเรียน</th>" +
            "<th>ชื่อ-นามสกุล</th>" +
            "<th>เวลา</th>" +
            "<th>สถานะ</th>" +
            "<th>จัดการ</th>" +
            "</tr>";

        let hasRecord = false;

        for (let i = 0; i < classes[classIndex].students.length; i++) {

            let student = classes[classIndex].students[i];

            if (student.attendance) {

                for (let j = 0; j < student.attendance.length; j++) {

                    let record = student.attendance[j];

                    if ((record.date == selectedDate1 ||
                        record.date == selectedDate2) &&
                        Number(record.period) == period) {

                        html +=
                            "<tr>" +
                            "<td>" + student.id + "</td>" +
                            "<td>" + student.firstname + " " + student.lastname + "</td>" +
                            "<td>" + (record.time || "-") + "</td>" +
                            "<td>" + getStatusText(record.status) + "</td>" +
                            "<td>" +
                            "<button onclick='editAttendanceRecord(" +
                            classIndex + "," + i + "," + j + ")'>แก้ไข</button>" +
                            "</td>" +
                            "</tr>";
                        hasRecord = true;
                        break;
                    }
                }
            }
        }

        if (hasRecord == false) {

            html +=
                "<tr>" +
                "<td colspan='5'>ยังไม่มีการเช็กชื่อ</td>" +
                "</tr>";

        }

        html += "</table>";
    }

    content.innerHTML = html;
}

function editAttendanceRecord(classIndex, studentIndex, recordIndex) {

    let student = classes[classIndex].students[studentIndex];
    let record = student.attendance[recordIndex];

    let newStatus = prompt(
        "เลือกสถานะใหม่\n\n" +
        "1 = มาเรียน\n" +
        "2 = ขาดเรียน\n" +
        "3 = มาสาย\n" +
        "4 = ลา",
        "1"
    );

    if (newStatus == "1") {
        record.status = "present";
    }
    else if (newStatus == "2") {
        record.status = "absent";
    }
    else if (newStatus == "3") {
        record.status = "late";
    }
    else if (newStatus == "4") {
        record.status = "leave";
    }
    else {
        alert("กรุณาเลือก 1, 2, 3 หรือ 4");
        return;
    }

    localStorage.setItem("classes", JSON.stringify(classes));

    showTodayRecords(classIndex);
}

function showWeekRecords(classIndex) {

    let content = document.querySelector("#records-content");

    let startDate = document.querySelector("#week-start").value;
    let endDate = document.querySelector("#week-end").value;

    if (startDate == "" || endDate == "") {
        content.innerHTML = "<p>กรุณาเลือกวันที่เริ่มต้นและวันที่สิ้นสุด</p>";
        return;
    }

    let startParts = startDate.split("-");
    let endParts = endDate.split("-");

    let start = new Date(
        Number(startParts[0]),
        Number(startParts[1]) - 1,
        Number(startParts[2])
    );

    let end = new Date(
        Number(endParts[0]),
        Number(endParts[1]) - 1,
        Number(endParts[2])
    );

    if (start > end) {
        content.innerHTML = "<p>วันที่เริ่มต้นต้องมาก่อนวันที่สิ้นสุด</p>";
        return;
    }

    let html =
        "<h2>สรุปการเข้าเรียน</h2>" +
        "<table class='records-summary-table'>" +
        "<tr>" +
        "<th>รหัสนักเรียน</th>" +
        "<th>ชื่อ-นามสกุล</th>" +
        "<th>มาเรียน</th>" +
        "<th>ขาดเรียน</th>" +
        "<th>มาสาย</th>" +
        "<th>ลา</th>" +
        "<th>อัตราการมาเรียน</th>" +
        "</tr>";

    for (let i = 0; i < classes[classIndex].students.length; i++) {

        let student = classes[classIndex].students[i];

        let present = 0;
        let absent = 0;
        let late = 0;
        let leave = 0;

        let checkedDays = [];

        if (student.attendance) {

            for (let j = 0; j < student.attendance.length; j++) {

                let record = student.attendance[j];

                if (Number(record.period) != 1) {
                    continue;
                }

                let parts = record.date.split("/");

                if (parts.length != 3) {
                    continue;
                }

                let recordDate = new Date(
                    Number(parts[2]) - 543,
                    Number(parts[1]) - 1,
                    Number(parts[0])
                );

                if (recordDate >= start &&
                    recordDate <= end &&
                    recordDate.getDay() != 0 &&
                    recordDate.getDay() != 6) {

                    if (checkedDays.indexOf(record.date) == -1) {

                        checkedDays.push(record.date);

                        if (record.status == "present") {
                            present++;
                        }

                        if (record.status == "absent") {
                            absent++;
                        }

                        if (record.status == "late") {
                            late++;
                        }

                        if (record.status == "leave") {
                            leave++;
                        }
                    }
                }
            }
        }

        let total = present + absent + late + leave;

        let percentage = 0;

        if (total > 0) {
            percentage = Math.round((present / total) * 100);
        }

        html +=
            "<tr>" +
            "<td>" + student.id + "</td>" +
            "<td>" + student.firstname + " " + student.lastname + "</td>" +
            "<td>" + present + "</td>" +
            "<td>" + absent + "</td>" +
            "<td>" + late + "</td>" +
            "<td>" + leave + "</td>" +
            "<td>" + percentage + "%</td>" +
            "</tr>";
    }

    html += "</table>";

    content.innerHTML = html;
}

function showMonthRecords(classIndex) {

    let content = document.querySelector("#records-content");

    let selectedMonth = document.querySelector("#record-month").value;

    if (selectedMonth == "") {
        content.innerHTML = "<p>กรุณาเลือกเดือน</p>";
        return;
    }

    let monthParts = selectedMonth.split("-");

    let selectedYear = Number(monthParts[0]);
    let selectedMonthNumber = Number(monthParts[1]);

    let html =
        "<h2>สรุปการเข้าเรียนประจำเดือน</h2>" +
        "<table class='records-summary-table'>" +
        "<tr>" +
        "<th>รหัสนักเรียน</th>" +
        "<th>ชื่อ-นามสกุล</th>" +
        "<th>มาเรียน</th>" +
        "<th>ขาดเรียน</th>" +
        "<th>มาสาย</th>" +
        "<th>ลา</th>" +
        "<th>อัตราการมาเรียน</th>" +
        "</tr>";

    for (let i = 0; i < classes[classIndex].students.length; i++) {

        let student = classes[classIndex].students[i];

        let present = 0;
        let absent = 0;
        let late = 0;
        let leave = 0;

        let checkedDays = [];

        if (student.attendance) {

            for (let j = 0; j < student.attendance.length; j++) {

                let record = student.attendance[j];

                if (Number(record.period) != 1) {
                    continue;
                }

                let parts = record.date.split("/");

                if (parts.length != 3) {
                    continue;
                }

                let recordYear = Number(parts[2]) - 543;
                let recordMonth = Number(parts[1]);

                if (recordYear == selectedYear &&
                    recordMonth == selectedMonthNumber &&
                    new Date(recordYear, recordMonth - 1, Number(parts[0])).getDay() != 0 &&
                    new Date(recordYear, recordMonth - 1, Number(parts[0])).getDay() != 6) {

                    if (checkedDays.indexOf(record.date) == -1) {

                        checkedDays.push(record.date);

                        if (record.status == "present") {
                            present++;
                        }

                        if (record.status == "absent") {
                            absent++;
                        }

                        if (record.status == "late") {
                            late++;
                        }

                        if (record.status == "leave") {
                            leave++;
                        }
                    }
                }
            }
        }

        let total = present + absent + late + leave;

        let percentage = 0;

        if (total > 0) {
            percentage = Math.round((present / total) * 100);
        }

        html +=
            "<tr>" +
            "<td>" + student.id + "</td>" +
            "<td>" + student.firstname + " " + student.lastname + "</td>" +
            "<td>" + present + "</td>" +
            "<td>" + absent + "</td>" +
            "<td>" + late + "</td>" +
            "<td>" + leave + "</td>" +
            "<td>" + percentage + "%</td>" +
            "</tr>";
    }

    html += "</table>";

    content.innerHTML = html;
}


function showTermRecords(classIndex) {

    let term = document.querySelector("#record-term").value;

    let start = localStorage.getItem("term" + term + "Start");
    let end = localStorage.getItem("term" + term + "End");

    let content = document.querySelector("#records-content");

    if (start == null || end == null) {

        content.innerHTML =
            "<p>กรุณากำหนดวันภาคเรียนที่ " + term + " ในหน้า Admin ก่อน</p>";

        return;
    }

    let startDate = new Date(start);
    let endDate = new Date(end);

    let students = classes[classIndex].students;

    let html = "";

    html += "<h2 class='record-period-title'>ภาคเรียนที่ " +
        term + "</h2>";

    html += "<p>ตั้งแต่ " + start +
        " ถึง " + end + "</p>";

    html += "<table class='records-summary-table'>";

    html += "<tr>";
    html += "<th>รหัสนักเรียน</th>";
    html += "<th>ชื่อ-นามสกุล</th>";
    html += "<th>มาเรียน</th>";
    html += "<th>ขาดเรียน</th>";
    html += "<th>มาสาย</th>";
    html += "<th>ลา</th>";
    html += "<th>อัตราการเข้าเรียน</th>";
    html += "</tr>";

    for (let i = 0; i < students.length; i++) {

        let present = 0;
        let absent = 0;
        let late = 0;
        let leave = 0;

        if (students[i].attendance) {

            for (let j = 0; j < students[i].attendance.length; j++) {

                let record = students[i].attendance[j];

                if (Number(record.period) != 1) {
                    continue;
                }

                let parts = record.date.split("/");

                let recordDate = new Date(
                    Number(parts[2]) - 543,
                    Number(parts[1]) - 1,
                    Number(parts[0])
                );

                if (recordDate >= startDate &&
                    recordDate <= endDate &&
                    recordDate.getDay() != 0 &&
                    recordDate.getDay() != 6) {

                    if (record.status == "present") {
                        present++;
                    }

                    if (record.status == "absent") {
                        absent++;
                    }

                    if (record.status == "late") {
                        late++;
                    }

                    if (record.status == "leave") {
                        leave++;
                    }
                }
            }
        }

        let total = present + absent + late + leave;

        let percentage = 0;

        if (total > 0) {
            percentage = Math.round((present / total) * 100);
        }

        html += "<tr>";

        html += "<td>" + students[i].id + "</td>";

        html += "<td>" +
            students[i].firstname + " " +
            students[i].lastname +
            "</td>";

        html += "<td>" + present + "</td>";

        html += "<td>" + absent + "</td>";

        html += "<td>" + late + "</td>";

        html += "<td>" + leave + "</td>";

        html += "<td>" + percentage + "%</td>";

        html += "</tr>";
    }

    html += "</table>";

    content.innerHTML = html;
}

if (document.querySelector("#records-content")) {
    showRecordsPage();
}

function showAdminCounts() {

    let studentCount = 0;

    for (let i = 0; i < classes.length; i++) {
        studentCount += classes[i].students.length;
    }

    document.querySelector("#student-count").innerHTML = studentCount;
    document.querySelector("#teacher-count").innerHTML = teachers.length;
    document.querySelector("#class-count").innerHTML = classes.length;
}


if (document.querySelector("#student-count")) {
    showAdminCounts();
}