var map;
var jsonVal;
var host = "https://search-tweetmap-rq75kq5ijnreibhxh4azl7zvyy.us-west-2.es.amazonaws.com";

function initm() {

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: new google.maps.LatLng(40.7, 70)
    });
}



$(document).ready(function() {
    $("#cd-dropdown").change(function() {

        initm();

        var searchID = document.getElementById("cd-dropdown");
        var searchTopic = searchID.options[searchID.selectedIndex].text;

        var choice = ""

        var tweetsText = ''

        if (searchTopic != "Select Topic") {

            var searchCriteria = host + "/tweetstwitter/Tweetsss/_search?q=text:" + searchTopic;

            $.ajax({
                url: searchCriteria,
                type: 'GET',
                contentType: 'application/json; charset=UTF-8',
                dataType: "json",
                data: {
                    size: 1500
                },

                success: function(data) {
                    jsonVal = data.hits.hits;
                    console.log(jsonVal);
                    jsonVal.forEach(function(obj) {

                        var textarea = document.getElementById('textarea_id');


                        textarea.scrollTop = textarea.scrollHeight;

                        document.getElementById('textarea_id').value += obj._source.text + '\n\n\n'

                        var emotionIcon;

                        if (obj._source.emotion == 'positive')
                            emotionIcon = './img/darkgreen_MarkerP.png'
                        else if (obj._source.emotion == 'negative')
                            emotionIcon = './img/orange_MarkerN.png'
                        else if (obj._source.emotion == 'neutral')
                            emotionIcon = './img/yellow_MarkerN.png'
                        else
                            emotionIcon = ''


                        if (emotionIcon != '') {
                            var latLng = new google.maps.LatLng(obj._source.latitude, obj._source.longitude);
                            //   console.log(latLng)
                            var marker = new google.maps.Marker({
                                position: latLng,
                                map: map,
                                icon: emotionIcon
                            });
                            var infowindow = new google.maps.InfoWindow({
                                content: obj._source.text
                            });

                            google.maps.event.addListener(marker, 'click', function() {
                                infowindow.open(map, marker);
                            });
                        }

                    });
                }
            }).fail(function(error) {
                console.log(error);
            });



        }
    });
});
