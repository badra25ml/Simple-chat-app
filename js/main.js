  var ref = new Firebase("https://facebook-app.firebaseio.com/");

  ref.authWithOAuthPopup("facebook", function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
  initChat(authData.facebook);
   }
  },

  {scope: 'user_friends'});



  var initChat = function(friends) {
    $("textarea").on("keyup", function(event) {
      if (event.which === 13) {
        sendMessage(this.value);
        this.value = "";
      }
    });

    var sendMessage = function(textValue) {
      if (textValue) {
        ref.push({
          author: friends,
          message: textValue,
          messageDate: Firebase.ServerValue.TIMESTAMP
        });
      }
    };

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
    });
  }
