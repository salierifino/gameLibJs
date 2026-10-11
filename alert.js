
window.customAlert = function(text, icon = '⚠️') {

	document.getElementById('__customAlert')?.remove();

	const style = document.createElement('style');
	style.innerHTML = `
	#__customAlert{
	position:fixed;
	inset:0;
	background:rgba(0,0,0,.6);
	display:flex;
	justify-content:center;
	align-items:center;
	z-index:9999;

	}
	#__customAlertBox{
	background:#222;
	color:#fff;
	padding:16px;
	border-radius:12px;
	width:260px;
	text-align:center;
	font-family:sans-serif;
	}
	#__customAlertIcon{font-size:28px;margin-bottom:8px}
	#__customAlertText{font-size:14px;margin-bottom:12px}
	#__customAlertBtn{background:#fff;color:#000;border:0;
	border-radius:8px;padding:6px 16px}
	`;

	const overlay = document.createElement('div');
	overlay.id = '__customAlert';
	overlay.innerHTML = `
	<div id="__customAlertBox">
	<div id="__customAlertIcon">${icon}</div>
	<div id="__customAlertText">${text}</div>
	<button id="__customAlertBtn">OK</button>
	</div>
		`;

	document.head.appendChild(style);
	document.body.appendChild(overlay);

	const close = () => overlay.remove();
	overlay.querySelector('#__customAlertBtn').onclick = close;
}

