let socket = io("http://localhost:3000");


///////////////////////////////////////////////
$(function () {
  let doc;
  let flag = true;
  console.log("test");
  $("#btn_send").hide();
  $("#number").hide();
  $("input:file").change(function () {
    doc = document.getElementById('doc').files[0];
    console.log(doc);

    // ajax send data
    var form = new FormData();
    form.append("doc", doc);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://localhost:3000/upload",
      "method": "POST",
      "headers": {
        "cache-control": "no-cache",
        "postman-token": "895baf06-885c-917a-b7b3-32006e8dd338"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings).done(function (response) {
      response = JSON.parse(response);
      socket.emit('get-progress', response.doc_id);

      // console.log("TOTAL_PAGE:", total_page);
    });
  });

  // btn-send
  socket.on('info-progress', (data) => {
    if (flag == true) {
      let total_page = data.total_page;
      $("#btn_send").show();
      $("#number").show();
      $("#number").attr("max", total_page);
      let doc_id = data.base_url.split("/");
      doc_id = doc_id['2'];
      $("#number").attr("doc_id", doc_id);
      flag = false;
    }
    console.log("Data:", data);
  })


  $("#btn_send").click(function () {
    let doc_id = $("#number").attr("doc_id");
    console.log("DOCID:", doc_id);
    let page = $("#number").val();
    // socket.off('info-page');
    socket.emit('get-page', { doc_id: doc_id, page: page });
  })

  socket.on('info-page', function (data) {
    console.log("INFO-PAGE:",data);
    if (data.status == true) {
      $("#pdf").show();
      $("#pdf").attr('src', data.path_pdf);
      $("#png").show();
      $("#png").attr('src', data.path_png);
      $("#svg").show();
      $("#svg").attr('src', data.path_svg);
    }
    else if(data.status == false) {
      $("#pdf").show();
      $("#pdf").attr('src', '/image/loading.gif');
      $("#png").show();
      $("#png").attr('src', '/image/loading.gif');
      $("#svg").show();
      $("#svg").attr('src', '/image/loading.gif');
    }
    else if(data.status == 'not found') {
      $("#pdf").show();
      $("#pdf").attr('src', '/image/notfound.jpg');
      $("#png").show();
      $("#png").attr('src', '/image/notfound.jpg');
      $("#svg").show();
      $("#svg").attr('src', '/image/notfound.jpg');
    }
  })
})




























// var socket = io("http://localhost:3000");

// socket.on("server-send-dki-thatbai", function(){
//   alert("Sai Username (co nguoi da dang ki roi!!!)");
// });

// socket.on("server-send-danhsach-Users", function(data){
//   $("#boxContent").html("");
//   data.forEach(function(i){
//     $("#boxContent").append("<div class='user'>" + i + "</div>");
//   });
// });

// socket.on("server-send-dki-thanhcong", function(data){
//   $("#currentUser").html(data);
//   $("#loginForm").hide(2000);
//   $("#chatForm").show(1000);
// });

// socket.on("server-send-mesage", function(data){
//   $("#listMessages").append("<div class='ms'>" + data.un + ":" + data.nd +"</div>");
// });

// socket.on("ai-do-dang-go-chu", function(data){
//   $("#thongbao").html("<img width='20px' src='typing05.gif'> " + data);
// });

// socket.on("ai-do-STOP-go-chu", function(){
//   $("#thongbao").html("");
// });


// $(document).ready(function(){
//   $("#loginForm").show();
//   $("#chatForm").hide();

//   $("#txtMessage").focusin(function(){
//     socket.emit("toi-dang-go-chu");
//   })

//   $("#txtMessage").focusout(function(){
//     socket.emit("toi-stop-go-chu");
//   })

//   $("#btnRegister").click(function(){
//     socket.emit("client-send-Username", $("#txtUsername").val());
//   });

//   $("#btnLogout").click(function(){
//     socket.emit("logout");
//     $("#chatForm").hide(2000);
//     $("#loginForm").show(1000);
//   });

//   $("#btnSendMessage").click(function(){
//     socket.emit("user-send-message", $("#txtMessage").val());
//   });


// });
