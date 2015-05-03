function LocationHelper() {

}

function isLetter(char) {

	return char >= 97 && char <= 122;
}

LocationHelper.ConvertCellToLocation = function(cell) {

	var x = 0;
	var y = 0;

	var loops = 0;
	for(var i =0; i < cell.length; i++)
	{
		var c = cell.charCodeAt(i);
		if (isLetter(c))
		{
			var n = c - 97;
			y += loops * 27 + n;
			loops++;
		}
		else
		{
			if (loops == 0)
				break;

			var rem = cell.substr(i, cell.length);
			var num = Number(rem);
			if (num != NaN)
			{
				x = num-1;
				break;
			}
		}
	}

	return {
		x: x,
		y: y,
		location: function() {

          var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          var len = alphabet.length;
          var data = "";
          if (y >= len) {
            data = alphabet[y / len - 1] + alphabet[y % len];
          }
          else {
            data = alphabet[y];
          }

          return data + (x+1);
        }
    };
}

LocationHelper.Lookup = function(cur_location, data){

	if (cur_location === undefined) return false;

	data = data.toLowerCase();

	var x = cur_location.x;
	var y = cur_location.y;

	if (data === "up" ||
		data === "down" ||
		data === "left" ||
		data === "right"	)
		{
			if (data === "up")
			{
			    y--;
			}
			else if (data ==="down")
			{
			    y++;
			}
			else if (data === "left")
			{
			    x--;
			}
			else if (data === "right")
			{
			    x++;
			}

			var rLoc = 
			{
				x: x, 
				y: y,
				location: function() {

		          var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		          var len = alphabet.length;
		          var data = "";
		          if (y >= len) {
		            data = alphabet[y / len - 1] + alphabet[y % len];
		          }
		          else {
		            data = alphabet[y];
		          }
		
		          return data + (x+1);
        		}
			};
			
			return rLoc;
		}
		else
		{
			var loc = LocationHelper.ConvertCellToLocation(data);
			return loc;
		}
};



module.exports = LocationHelper;