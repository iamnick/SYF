$('#playcount').on('pageinit', function(){	
	// loop through roster, create a list item element for each player
	team.roster = sortArrayByKey(team.roster, 'number');
	for (var k in team.roster) {
		if (k < 11) {
			insertLocation = '#activeDivider';
			isActive = true;
		} else {
			insertLocation = '#subsDivider';
			isActive = false;
		}
		
		// initialize some new object properties that aren't stored in localstorage
		team.roster[k].selected = false;
		team.roster[k].plays = 0;
		team.roster[k].active = isActive;
		
		var newLi = $(document.createElement('li'))
			.html(team.roster[k].number + ' ' + team.roster[k].name + '<span class="numPlays">0</span>')
			.attr('id', k)
			.insertAfter(insertLocation);
		
		// bind click event to each list item	
		newLi.bind('click', function(){
			if (team.roster[this.id].selected === true) {
				team.roster[this.id].selected = false;
				$(this).css('background-image', '-webkit-gradient(linear,left top,left bottom,from(#f9f9f9),to(#eee))');
			} else {
				team.roster[this.id].selected = true;
				$(this).css('background-image', '-webkit-gradient(linear,left top,left bottom,from(#d0d0d0),to(#dfdfdf))');
			}
		});
	}
	console.log(team.roster);
	sortList();
	// refresh the list to apply styling
	$('#playerList').listview('refresh');
});

$('#makeSub').on('click', function() {
	// empty strings to store player info to later insert into the dialog
	playersIn = "";
	playersOut = "";
	
	// loop through the roster to check if their list item was selected, then sub them accordingly
	for (var k in team.roster) {
		// if the player is selected, we need to move their list item
		if (team.roster[k].selected === true) {
			if (team.roster[k].active === true) {
				$('#' + k).detach().insertAfter('#subsDivider');
				playersOut += team.roster[k].number + " " + team.roster[k].name + "<br />";
				team.roster[k].active = false;
			} else {
				$('#' + k).detach().insertAfter('#activeDivider');
				playersIn += team.roster[k].number + " " + team.roster[k].name + "<br />";
				team.roster[k].active = true;
			}
			// de-select the list item
			$('#' + k).css('background-image', '-webkit-gradient(linear,left top,left bottom,from(#f9f9f9),to(#eee))');
			team.roster[k].selected = false;
		}
	}
	
	// update the dialog
	if (playersIn === "") {
		$('#playersIn').html("None");
	} else {
		$('#playersIn').html(playersIn);
	}
	
	if (playersOut === "") {
		$('#playersOut').html("None");
	} else {
		$('#playersOut').html(playersOut);
	}
		
	// refresh the list
	sortList();
	$('#playerList').listview('refresh');
});

$('#runPlay').on('click', function() {
	// check to make sure 11 players are active
	var activeTotal = 0;
	for (var i = 0; i < team.roster.length; i++) {
		if (team.roster[i].active === true) {
			activeTotal++;
		}
	}
	
	if (activeTotal !== 11) {
		$('#numActiveSpan').html(activeTotal);
		$.mobile.changePage('#errorDialog','pop',false,true);
		return false;
	}
	
	// loop through the roster and add 1 to their play total if they are active
	for (var k in team.roster) {
		if (team.roster[k].active === true) {
			team.roster[k].plays++;
		}
		// update numPlays span to show new value
		$('#' + k + ' span').html(team.roster[k].plays);
	}
	// refresh the list
	$('#playerList').listview('refresh');
});

var sortArrayByKey = function (array, key) {
	var compareByKey = function (a, b) {
		var x = a[key]; var y = b[key];
		return x - y;
	}
	array.sort(compareByKey);	
	return array;
}

var sortList = function () {
	// detach all list items
	for (var i = team.roster.length - 1; i >= 0; i--) {
		if (team.roster[i].active === true) {
			$('#' + i).detach().insertAfter('#activeDivider');
		} else {
			$('#' + i).detach().insertAfter('#subsDivider');
		}
	}
}

$("[data-role=footer]").fixedtoolbar({ tapToggle: false });

/* Notes
	- Add 'options' dialog (top right, gear icon button, no text?) to turn off alerts for each sub
*/


// Hard coded 'team' object
var team = {
	"name": "Simsbury Trojans",
	"players": 14,
	"roster": [
		{"name": "Christina", "number": 2},
		{"name": "Cael", "number": 30},
		{"name": "Ryan", "number": 32},
		{"name": "Jack", "number": 10},
		{"name": "Jameson", "number":  86},
		{"name": "Zachary", "number": 44},
		{"name": "Max", "number": 70},
		{"name": "James", "number": 13},
		{"name": "Brendan", "number": 27},
		{"name": "Vaughn", "number": 56},
		{"name": "Isaac", "number": 28},
		{"name": "Maxim", "number": 60},
		{"name": "Matt", "number": 65},
		{"name": "Sam", "number": 72} 
	]
}