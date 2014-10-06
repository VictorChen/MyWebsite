function drawapp(){
	var doc = $(document);
	var	win = $(window);
	var canvas = $('<canvas width="1900" height="1000"></canvas>').prependTo('body');
	var ctx = canvas[0].getContext('2d');
	var id = Math.round($.now()*Math.random()); // Generate a unique ID
	var clients = {};
	var drawing = false;
	var socket = io.connect();
	var prev = {};
	var lastEmit = $.now();	// current time
	$('#numClients').text("Connecting... Please wait!");

	var reconnect = setInterval(function(){
		if (!socket.socket.connected){
			socket.socket.connect();
		}else{
			clearInterval(reconnect);
			$('canvas').css('cursor', 'url("/images/pencil.gif"), auto');
			canvas.on('mousedown', function(e){
				e.preventDefault();
				drawing = true;
				prev.x = e.pageX;
				prev.y = e.pageY;
				socket.emit('mousedown',{
					'x': e.pageX,
					'y': e.pageY,
					'id': id
				});
			});
		}
	}, 3000);

	$("#back-btn").click(function(){
		clearInterval(reconnect);
		socket.disconnect();
	});

	canvas.on('mouseup mouseleave', function(){
		drawing = false;
	});

	canvas.on('mousemove', function(e){
		if (drawing){
			if($.now() - lastEmit > 30){	// rate of sending packets
				socket.emit('mousemove', {
					'x': e.pageX,
					'y': e.pageY,
					'id': id
				});
				lastEmit = $.now();
			}
			drawLine(prev.x, prev.y, e.pageX, e.pageY);
			prev.x = e.pageX;
			prev.y = e.pageY;
		}
	});

	socket.on('moving', function(data){
		if(clients[data.id]){
			drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y);
		}
		clients[data.id] = data;
		clients[data.id].updated = $.now();
	});

	socket.on('update', function(data){
		clients[data.id] = data;
		clients[data.id].updated = $.now();
	});

	socket.on('updateclients', function(numClients){
		if (numClients < 2)
			$('#numClients').text(numClients + " User Connected (invite your friends!)");
		else
			$('#numClients').text(numClients + " Users Connected");
	});

	setInterval(function(){
		for(ident in clients){
			if($.now() - clients[ident].updated > 10000){
				delete clients[ident];
			}
		}
	}, 10000);

	function drawLine(fromx, fromy, tox, toy){
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.stroke();
	}
}