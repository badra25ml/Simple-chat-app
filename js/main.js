var ref = new Firebase("https://facebook-app.firebaseio.com/");
$("#log-out").click(function(){
  alert("You Have Successfully Logged Out");
  ref.unauth();
})
$("#log-in").click(function(){
  ref.onAuth(function(authData) {
    if (authData !== null) {
      initChat(authData.facebook);
      console.log("Authenticated successfully with payload.");
    }
    else {
      // Try to authenticate with Facebook via OAuth redirection
      ref.authWithOAuthRedirect("facebook", function(authData, error) {
        if (error) {
          console.log("Login Failed!", error)
        }
      })
    }
  });
});
function initChat(friends) {
  $("textarea").on("keyup", function(event) {
    if (event.which === 13 ) {
      sendMessage(this.value);
      this.value = "";
    }
  });
  $("textarea").on("keyup", function(){
    if(this.value.length <= 1)
    {
      // // ref.push({
      // //   author: friends
      // // });
      // ref.on("child_added", function(whoIsTyping){
      //   console.log(whoIsTyping.key() + " is typing")
      // })
    }
  })
  var  sendMessage = function(textValue) {
    if (textValue) {
      ref.push({
        author: friends,
        message: textValue,
        messageDate: Firebase.ServerValue.TIMESTAMP
      });
    }
  };
  $("button").click(function(){
    sendMessage($("textarea").val());
    $("textarea").val("");
  });
  var $messageTemplate = $(".text:first");
  ref.on("child_added", function(snapshot){
    var newMessage = snapshot.val();
    if (newMessage.author && newMessage.message && newMessage.message.trim().length > 0){
      var $messageDiv = $messageTemplate.clone().removeClass("hidden")
      $messageDiv.find(".time").text(moment(newMessage.messageDate).format("lll"));
      $messageDiv.find(".author").text(newMessage.author.displayName || newMessage.author.email );
      $messageDiv.find(".message").html(marked(newMessage.message));
      $messageDiv.find(".picture").attr("src", newMessage.author.profileImageURL);
      $("#chat").prepend($messageDiv);
    }
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
    console.log(snapshot)
  });
};
