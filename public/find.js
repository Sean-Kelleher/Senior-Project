var pairs = [{id:1, pix:20}, {id:2, pix:40}, {id:3, pix:80}];
var future = [{event_id:1, fut_id:2}, {event_id:2, fut_id:3}];

/*function matches(elem, i){
	return elem.id==i;
}
*/

function getIt(i){
	var ret = pairs.find(function(elem){
			return elem.id==future[i].fut_id;
		});
	return ret;
}

 console.log(getIt(0));