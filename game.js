/*********************************************
 * Tululoo Game Maker v1.2.8
 *
 * Creators 
 * Zoltan Percsich
 * Vadim "YellowAfterlife" Dyachenko
 *
 * (c) SilentWorks 2011
 * All rights reserved.
 * www.tululoo.com
 *
 * Contributors:
 * Csaba Herbut
 ********************************************/

// misc variables:
var mouse_x = 0, mouse_y = 0;
var room_current = null;
var room_speed = 30, fps = room_speed;
var room_background = null;
var room_width = 0;
var room_height = 0;
var room_background_color_show = true;
var room_background_color_red = 0, room_background_color_green = 0, room_background_color_blue = 0;
var room_viewport_width = 0, room_viewport_height = 0;
var room_viewport_object = null;
var room_viewport_hborder = 0, room_viewport_vborder = 0;
var room_viewport_x = 0, room_viewport_y = 0;
// keyboard functions:
function keyboard_check(_key) { return key_down[_key]; }
function keyboard_check_pressed(_key) { return key_pressed[_key]; }
function keyboard_check_released(_key) { return key_released[_key]; }
// mouse functions:
function mouse_check() { return mouse_down; }
function mouse_check_pressed() { return mouse_pressed; }
function mouse_check_released() { return mouse_released; }
// virtual keys:
function vkey() {
	this.top = 0;
	this.left = 0;
	this.right = 0;
	this.bottom = 0;
	this.key = 0;
	this.down = false;
	this.active = true;
}
function vkey_add(_x, _y, _w, _h, _k)
{
	var _v = new vkey();
	_v.left = _x;
	_v.top = _y;
	_v.right = _x + _w;
	_v.bottom = _y + _h;
	_v.width = _w;
	_v.height = _h;
	_v.key = _k;
	tu_vkeys.push(_v);
	return _v;
}
function tu_idle() { } // left empty on purpose
// minimal math:
var max = Math.max, min = Math.min, round = Math.round, floor = Math.floor, ceil = Math.ceil;
var sin = Math.sin, cos = Math.cos, sqrt = Math.sqrt, tan = Math.tan, rand = Math.random;
var arccos = Math.acos, arcsin = Math.asin, arctan = Math.atan, arctan2 = Math.atan2, trace = console.log;
function abs(_value) { return _value < 0 ? -_value : _value; }
function sign(_value) { return _value > 0 ? 1 : _value < 0 ? -1 : 0; }
function choose() { return arguments[~~(Math.random() * arguments.length)]; }
function random(_value) { return Math.random() * _value; }
function irandom(_value) { return ~~(Math.random() * _value + 1); }
// trig functions:
function lengthdir_x(_length, _direction) { return _length * Math.cos(_direction * tu_d2r); }
function lengthdir_y(_length, _direction) { return _length * Math.sin(_direction * tu_d2r); }
function point_distance(_x1, _y1, _x2, _y2) { return Math.sqrt(Math.pow(( _x1 - _x2), 2) + Math.pow((_y1 - _y2), 2)); }
function point_direction(_x1, _y1, _x2, _y2) { return Math.atan2(_y2 - _y1, _x2 - _x1) * tu_r2d; }
function degtorad(_degree) { return _degree * tu_d2r; }
function radtodeg(_degree) { return _degree * tu_r2d; }
// sound functions:
function sound_mode(_sound, _mode) {
	if (_sound.audio.networkState == _sound.audio.NETWORK_NO_SOURCE) return;
	switch (_sound.type) {
	case "wav": if (!tu_wav_supported) return; break;
	case "ogg": if (!tu_ogg_supported) return; break;
	case "mp3": if (!tu_mp3_supported) return; break;
	}
	if (_mode != 3) {
		_sound.audio.pause();
		if (_mode != 0) {
			_sound.audio.currentTime = 0;
		} else return;
		_sound.audio.loop = _mode > 1;
	}
	_sound.audio.play();
}
function sound_play(_sound) { sound_mode(_sound, 1); }
function sound_loop(_sound) { sound_mode(_sound, 2); }
function sound_resume(_sound) { sound_mode(_sound, 3); }
function sound_stop(_sound) { sound_mode(_sound, 0); }
function sound_stop_all() { for ( var _s = 0; _s < tu_audios.length; _s++) sound_stop( tu_audios[_s] ); }
function sound_volume( _sound, _volume) {
	if (_sound.audio.networkState == _sound.audio.NETWORK_NO_SOURCE) return;
	_sound.audio.volume = _volume;
}
// draw sprite:
function draw_sprite(_sprite_index, _sub_image, _x, _y) {
	if (_sprite_index == null) return;
	if (_sub_image > _sprite_index.frames.length - 1) _sub_image = 0;
	tu_context.save();
	tu_context.translate(_x - room_viewport_x, _y - room_viewport_y);
	tu_context.globalAlpha = tu_draw_alpha;
	tu_context.drawImage(_sprite_index.frames[~~_sub_image], -_sprite_index.xoffset, -_sprite_index.yoffset);
	tu_context.restore();
}
function draw_sprite_part(_sprite_index, _sub_image, _left, _top, _width, _height, _x, _y) {
	if (_sprite_index == null) return;
	if (_sub_image >= _sprite_index.frames.length) _sub_image = _sub_image % _sprite_index.frames.length;
	tu_context.save();
	tu_context.translate(_x - room_viewport_x, _y - room_viewport_y);
	tu_context.globalAlpha = tu_draw_alpha;
	tu_context.drawImage(_sprite_index.frames[~~_sub_image], _left, _top, _width, _height, 0, 0, _width, _height);
	tu_context.restore();
}
function draw_sprite_ext(_sprite_index, _sub_image, _x, _y, _xscale, _yscale, _rotation, _alpha) {
	if (_sprite_index == null) return;
	if (_sub_image >= _sprite_index.frames.length) _sub_image = _sub_image % _sprite_index.frames.length;
	tu_context.save();
	tu_context.translate(_x - room_viewport_x, _y - room_viewport_y);
	tu_context.rotate(degtorad(_rotation));
	tu_context.scale(_xscale, _yscale);
	tu_context.globalAlpha = _alpha;
	tu_context.drawImage(_sprite_index.frames[~~_sub_image], -_sprite_index.xoffset , -_sprite_index.yoffset, _sprite_index.width, _sprite_index.height);
	tu_context.restore();
}
// draw text:
function draw_text(_x, _y, _text) {
	tu_context.font = tu_draw_font;
	tu_context.textAlign = tu_draw_halign;
	tu_context.textBaseline = tu_draw_valign;
	tu_context.fillStyle = tu_context.strokeStyle = "rgba(" + tu_draw_color + ", " + tu_draw_alpha + ")";
	tu_context.fillText( _text, _x - room_viewport_x, _y - room_viewport_y );
}
// draw shapes:
function draw_rectangle(_x1, _y1, _x2, _y2, _outline) {
	tu_context.fillStyle = tu_context.strokeStyle = "rgba(" + tu_draw_color + ", " + tu_draw_alpha + ")";
	tu_context.beginPath();
	if (_outline) tu_context.strokeRect( _x1- room_viewport_x, _y1 - room_viewport_y, _x2 - _x1, _y2 - _y1 );
	else tu_context.fillRect( _x1- room_viewport_x, _y1 - room_viewport_y, _x2 - _x1, _y2 - _y1 );
	tu_context.closePath();
}
function draw_circle(_x, _y, _r, _outline) {
	tu_context.fillStyle = tu_context.strokeStyle = "rgba(" + tu_draw_color + ", " + tu_draw_alpha + ")";
	tu_context.beginPath();
	tu_context.arc( _x - room_viewport_x, _y - room_viewport_y, _r, 0, tu_2pi, true );
	tu_context.closePath();
	!_outline ? tu_context.fill() : tu_context.stroke();
}

function draw_line(_x1, _y1, _x2, _y2) {
	tu_context.strokeStyle = "rgba(" + tu_draw_color + ", " + tu_draw_alpha + ")";
	tu_context.beginPath();
	tu_context.moveTo( _x1 - room_viewport_x, _y1 - room_viewport_y );
	tu_context.lineTo( _x2 - room_viewport_x, _y2 - room_viewport_y );
	tu_context.closePath();
	tu_context.stroke();	
}
// draw settings:
function draw_set_alpha(_alpha) {
	tu_draw_alpha = _alpha;
}
function draw_set_color( _r, _g, _b) {
	tu_draw_color_red = _r;
	tu_draw_color_green = _g;
	tu_draw_color_blue = _b;
	tu_draw_color = tu_draw_color_red + "," + tu_draw_color_green + "," + tu_draw_color_blue;
	tu_context.fillStyle = "rgba(" + tu_draw_color + ", " + tu_draw_alpha + ")";
	tu_context.strokeStyle = "rgb(" + tu_draw_color + ")";
}
function draw_set_linewidth(_width) { tu_context.lineWidth = _width; }
// draw settings - font:
function draw_set_font (_font) {
	tu_draw_font = (_font.bold == 1 ? "bold" : "") + " " + (_font.italic == 1 ? "italic" : "") + " " + _font.size + "px " + _font.family;
	tu_context.font = tu_draw_font;
	tu_context.textAlign = tu_draw_halign;
	tu_context.textBaseline = tu_draw_valign;
}
function draw_set_halign(_halign) { tu_draw_halign = _halign; }
function draw_set_valign(_valign) { tu_draw_valign = _valign; }
// room translations:
function room_goto(_scene) {
	tu_viewport_inst = null;
	tu_room_to_go = _scene;
}
function room_goto_next() {
	var _ri = 0;
	for (var _r = 0; _r < tu_scenes.length; _r++) if (tu_scenes[_r] == room_current) _ri = _r;
	if (typeof tu_scenes[(_ri + 1)] == "object") room_goto(tu_scenes[_ri + 1]);
}
function room_goto_previous() {
	var _ri = 0;
	for (var _r = 0; _r < tu_scenes.length; _r++) if (tu_scenes[_r] == room_current) _ri = _r;
	if (typeof tu_scenes[(_ri - 1)] == "object") room_goto(tu_scenes[_ri - 1]);
}
function room_goto_first() { room_goto(tu_scenes[0]); }
function room_goto_last() { room_goto(tu_scenes[(tu_scenes.length - 1)]); }
function room_restart() { room_goto(room_current); }
// instance functions:
function instance_create_(_x, _y, _object) {
	var o = new _object.constructor;
	o.parameters = arguments.length > 3 ? Array.prototype.slice.call(arguments, 3) : null;
	o.object_index = _object;
	o.__instance = true;
	o.xstart = o.x = _x;
	o.ystart = o.y = _y;
	o._depth = o.depthstart;
	instance_activate(o);
	return o;
}
function instance_create(_x, _y, _object) {
	var o = instance_create_.apply(this, arguments);
	o.on_creation();
	return o;
}
function instance_number(_object) {
	return instance_list(_object).length;
}
function instance_first(_object) {
	var l = instance_list(_object);
	return l.length ? l[0] : null;
}
// instance collision checking:
function instance_position(_x, _y, _object, _mult) {
	var _o, _s, _q = (_object.__instance ? [_object] : instance_list(_object));
	var _tm = (_mult) ? true : false;
	if (_tm) _ta = [];
	for (var _i = 0, _il = _q.length; _i < _il; _i++) {
		_o = _q[_i];
		_s = _o.sprite_index;
		if (!_o.collision_checking) continue;
		if (_o == this) continue;
		switch (_s.collision_shape)
		{
		case "Box":
			if (_x < _o.x + _o.image_xscale * (_s.collision_left - _s.xoffset)) break;
			if (_x >= _o.x + _o.image_xscale * (_s.collision_right - _s.xoffset)) break;
			if (_y < _o.y + _o.image_yscale * (_s.collision_top - _s.yoffset)) break;
			if (_y >= _o.y + _o.image_yscale * (_s.collision_bottom - _s.yoffset)) break;
			if (!_tm) return _o;
			_ta.push(_o);
			break;
		case "Circle":
			var _r = _s.collision_radius * Math.max(_o.image_xscale, _o.image_yscale);
			var _dx = _o.x + (_s.width / 2 - _s.xoffset) - _x;
			var _dy = _o.y + (_s.height / 2 - _s.yoffset) - _y;
			if ((_dx * _dx) + (_dy * _dy) > _r * _r) break;
			if (!_tm) return _o;
			_ta.push(_o);
			break;
		}
	}
	return _tm ? _ta : null;
}
function __place_meeting__(_x, _y, _object, _mult) {
	this.other = null;
	if (!this.collision_checking) return;
	var _ts = this.sprite_index;
	if (_ts == null) return;
	var _tl = _x + this.image_xscale * (_ts.collision_left - _ts.xoffset);
	var _tr = _x + this.image_xscale * (_ts.collision_right - _ts.xoffset);
	var _tt = _y + this.image_yscale * (_ts.collision_top - _ts.yoffset);
	var _tb = _y + this.image_yscale * (_ts.collision_bottom - _ts.yoffset);
	var _tx = _x + this.image_xscale * (_ts.width / 2 - _ts.xoffset);
	var _ty = _y + this.image_yscale * (_ts.height / 2 - _ts.yoffset);
	var _td = _ts.collision_radius * Math.max(this.image_xscale, this.image_yscale);
	var _tz = (_object.__instance ? [_object] : instance_list(_object));
	var _tm = (_mult) ? true : false;
	if (_tm) _ta = [];
	for (var _i = 0, _l = _tz.length; _i < _l; _i++) {
		var _o = _tz[_i];
		var _os = _o.sprite_index;
		if (_os == null) continue;
		if (!_o.collision_checking) continue;
		if (_o == this) continue;
		var _to = _ts.collision_shape + _os.collision_shape;
		switch(_to)
		{
		case "BoxBox":
			if (_tb <= _o.y + _o.image_yscale * (_os.collision_top - _os.yoffset)) break;
			if (_tt >= _o.y + _o.image_yscale * (_os.collision_bottom - _os.yoffset)) break;
			if (_tr <= _o.x + _o.image_xscale * (_os.collision_left - _os.xoffset)) break;
			if (_tl >= _o.x + _o.image_xscale * (_os.collision_right - _os.xoffset)) break;
			this.other = _o;
			_o.other = this;
			if (!_tm) return _o;
			_ta.push(_o);
			break;
		case "BoxCircle":
			var _or = _os.collision_radius * Math.max(_o.image_xscale, _o.image_yscale);
			var _ox = _o.x + _o.image_xscale * (_os.width / 2 - _os.xoffset);
			var _oy = _o.y + _o.image_yscale * (_os.height / 2 - _os.yoffset);
			if (_tl - _ox >= _or) break;
			if (_ox - _tr >= _or) break;
			if (_tt - _oy >= _or) break;
			if (_oy - _tb >= _or) break;
			this.other = _o;
			_o.other = this;
			if (!_tm) return _o;
			_ta.push(_o);
			break;
		case "CircleBox":
			if (_td + _tx <= _o.x + _o.image_xscale * (_os.collision_left - _os.xoffset)) break;
			if (_tx - _td >= _o.x + _o.image_xscale * (_os.collision_right - _os.xoffset)) break;
			if (_td + _ty <= _o.y + _o.image_yscale * (_os.collision_top - _os.yoffset)) break;
			if (_ty - _td >= _o.y + _o.image_yscale * (_os.collision_bottom - _os.yoffset)) break;
			this.other = _o;
			_o.other = this;
			if (!_tm) return _o;
			_ta.push(_o);
			break;
		case "CircleCircle":
			var _or = _os.collision_radius * Math.max(_o.image_xscale, _o.image_yscale);
			var _ox = _o.x + _o.image_xscale * (_os.width / 2 - _os.xoffset);
			var _oy = _o.y + _o.image_yscale * (_os.height / 2 - _os.yoffset);
			if ((_tx - _ox) * (_tx - _ox) + (_ty - _oy) * (_ty - _oy) > (_td + _or) * (_td + _or)) break;
			this.other = _o;
			_o.other = this;
			if (!_tm) return _o;
			_ta.push(_o);
			break;
		default:
		}
	}
	return _tm ? _ta : null;
}
function position_meeting(_x, _y, _object) {
	return instance_position(_x, _y, _object) != null;
}
function __move_towards_point__(_x, _y, _speed) {
	if (_speed == 0) return;
	if (this.x == _x && this.y == _y) return;
	var _dx = _x - this.x;
	var _dy = _y - this.y;
	var _dist = _dx * _dx + _dy * _dy;
	if (_dist < _speed * _speed) {
		this.x = _x;
		this.y = _y;
	} else {
		_dist = Math.sqrt(_dist);
		this.x += _dx * _speed / _dist;
		this.y += _dy * _speed / _dist;
	}
}

function __instance_destroy__() {
	tu_trash.push( this );
}
// web data:
function save_web_data(_name, _value) { window.localStorage.setItem(_name, _value); }
function save_web_integer(_name, _value) { window.localStorage.setItem("int_" + _name, _value); }
function save_web_float(_name, _value) { window.localStorage.setItem("float_" + _name, _value); }
function save_web_string(_name, _value) { window.localStorage.setItem("string_" + _name, _value); }
function load_web_data(_name) { return window.localStorage.getItem(_name); }
function load_web_integer(_name) { return parseInt(window.localStorage.getItem("int_" + _name)); }
function load_web_float(_name) { return parseFloat(window.localStorage.getItem("float_" + _name)); }
function load_web_string(_name) { return window.localStorage.getItem("string_" + _name); }
function delete_web_data(_name) { window.localStorage.removeItem(_name); }
function delete_web_integer(_name) { window.localStorage.removeItem("int_" + _name); }
function delete_web_float(_name) { window.localStorage.removeItem("float_" + _name); }
function delete_web_string(_name) { window.localStorage.removeItem("string_" + _name); }
function clear_web_data() { window.localStorage.clear(); }
function web_data_number() { return window.localStorage.length; }
// misc functions:
function pause_game( _key) {
	tu_paused = true;
	tu_unpausekey = _key;
}
function modal_end() {
	if (tu_modal == null) return;
	tu_modal.instance_destroy();
	tu_modal = null;
}
function modal_start(_inst, _draw) {
	if (tu_modal != null) modal_end();
	tu_modal = _inst;
	tu_modaldraw = _draw;
}
function show_mouse() { tu_canvas.style.cursor = "default"; }
function hide_mouse() { tu_canvas.style.cursor = "none"; }
//
function tu_detect_audio(_type) {
	var _au = document.createElement('audio');
	return _au.canPlayType && _au.canPlayType(_type).replace(/no/, '');
}
//
function tu_gettime() {
	return (new Date()).getTime();
}

/***********************************************************************
 * ENGINE
 ***********************************************************************/
var tu_sprites = [], tu_audios = [], tu_backgrounds = [], tu_fonts = [], tu_scenes = [];
var tu_depth = [], tu_depthi = [], tu_types = [], tu_persist = [];
var key_down = [], key_pressed = [], key_released = [], tu_vkeys = [];
var mouse_down = false, mouse_pressed = false, mouse_released = false;
var touch_x = [], touch_y = [], touch_count = 0;
var tu_wav_supported = tu_detect_audio('audio/wav; codecs="1"');
var tu_ogg_supported = tu_detect_audio('audio/ogg; codecs="vorbis"');
var tu_mp3_supported = tu_detect_audio('audio/mpeg;');
var tu_canvas = null, tu_context = null, tu_canvas_css = 'background-color:rgb(42,42,42);border:0;';
var tu_frame_time = tu_frame_step = tu_frame_el = tu_frame_count = 0, tu_elapsed,
	tu_prev_cycle_time = tu_prev_frame_time = tu_gettime();
var tu_draw_alpha = 1, tu_draw_color_red = 0, tu_draw_color_green = 0, tu_draw_color_blue = 0;
var tu_draw_font = "Arial 12px";
var tu_draw_color = "rgb(" + tu_draw_color_red + "," + tu_draw_color_green + "," + tu_draw_color_blue + ")";
var tu_draw_halign = "left", tu_draw_valign = "top";
var tu_loading = 0, tu_load_total = 0;
var tu_keys_pressed = [], tu_keys_released = [];
var tu_viewport_inst = null;
var tu_redraw, tu_redraw_auto = true;
var tu_room_to_go = null;
var tu_paused = false, tu_modal = null, tu_modaldraw = true;
var tu_unpausekey = 27;
var tu_r2d = -180 / Math.PI;
var tu_d2r = Math.PI / -180;
var tu_2pi = Math.PI * 2;
//
var vk_0 = 48, vk_1 = 49, vk_2 = 50, vk_3 = 51, vk_4 = 52, vk_5 = 53, vk_6 = 54;
var vk_7 = 55, vk_8 = 56, vk_9 = 57, vk_a = 65, vk_add = 107, vk_alt = 18, vk_b = 66;
var vk_backspace = 8, vk_c = 67, vk_ctrl = 17, vk_d = 68, vk_decimal = 110, vk_delete = 46;
var vk_divide = 111, vk_down = 40, vk_e = 69, vk_end = 35, vk_enter = 13, vk_escape = 27;
var vk_f1 = 112, vk_f2 = 113, vk_f3 = 114, vk_f4 = 115, vk_f5 = 116, vk_f6 = 117;
var vk_f7 = 118, vk_f8 = 119, vk_f9 = 120, vk_f10 = 121, vk_f11 = 122, vk_f12 = 123;
var vk_g = 71, vk_h = 72, vk_home = 36, vk_f = 70;
var vk_i = 73, vk_insert = 45, vk_j = 74, vk_k = 75, vk_l = 76, vk_left = 37, vk_m = 77;
var vk_multiply = 106, vk_n = 78, vk_num0 = 96, vk_num1 = 97, vk_num2 = 98, vk_num3 = 99;
var vk_num4 = 100, vk_num5 = 101, vk_num6 = 102, vk_num7 = 103, vk_num8 = 104, vk_num9 = 105;
var vk_o = 79, vk_p = 80, vk_pagedown = 34, vk_pageup = 33, vk_pause = 19, vk_q = 81
var vk_r = 82, vk_right = 39, vk_s = 83, vk_shift = 16, vk_space = 32, vk_subtract = 109;
var vk_t = 84, vk_tab = 9, vk_u = 85, vk_up = 38, vk_v = 86, vk_w = 87, vk_x = 88;
var vk_y = 89, vk_z = 90;

var fa_left = "left", fa_center = "center", fa_right = "right";
var fa_top = "top", fa_middle = "middle", fa_bottom = "bottom";
 
function __global__ () { }
global = new __global__();
//{ Events
function __keydownlistener__(_e) {
	var keyCode = window.event ? _e.which : _e.keyCode;
	if (!key_down[keyCode])
	{
		key_pressed[keyCode] = true;
		tu_keys_pressed.push(keyCode);
	}
	key_down[keyCode] = true;
};
function __keyuplistener__(_e) {
	var keyCode = window.event ? _e.which : _e.keyCode;
	if (key_down[keyCode])
	{
		key_released[keyCode] = true;
		tu_keys_released.push(keyCode);
	}
	key_down[keyCode] = false;
};
function __touchsim__(_x, _y) {
	var r = [{}];
	r[0].pageX = tu_canvas.offsetLeft + _x;
	r[0].pageY = tu_canvas.offsetTop + _y;
	__touchvkey__(r);
}
function __mousemovelistener__(_e) {
	if (_e.pageX != undefined && _e.pageY != undefined) {
		mouse_x = _e.pageX;
		mouse_y = _e.pageY;
	} else {
		mouse_x = _e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		mouse_y = _e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	if (room_current != null) {
		mouse_x -= tu_canvas.offsetLeft;
		mouse_y -= tu_canvas.offsetTop;			
	}
	if (mouse_down) __touchsim__(mouse_x, mouse_y);
};
function __mousedownlistener__(_e) {
	//if (!mouse_down) mouse_pressed = true;
	//mouse_down = true;
	__touchsim__(mouse_x, mouse_y);
};
function __mouseuplistener__(_e) {
	//if (mouse_down) mouse_released = true;
	//mouse_down = false;
	__touchvkey__([]);
};
function __touchvkey__(_t) {
	var _tx = 0, _ty = 0, _tc = 0;
	var _tl = _t.length;
	var _vl = tu_vkeys.length;
	var _i, _j, _c, _k;
	var _dx = tu_canvas.offsetLeft;
	var _dy = tu_canvas.offsetTop;
	touch_x = []; touch_y = []; touch_count = 0;
	for (_i = 0; _i < _vl; _i++) tu_vkeys[_i].count = 0;
	for (_i = 0; _i < _tl; _i++) {
		_c = 0;
		for (_j = 0; _j < _vl; _j++) {
			if (!tu_vkeys[_j].active) continue;
			if (_t[_i].pageX - _dx > tu_vkeys[_j].right) continue;
			if (_t[_i].pageX - _dx < tu_vkeys[_j].left) continue;
			if (_t[_i].pageY - _dy < tu_vkeys[_j].top) continue;
			if (_t[_i].pageY - _dy > tu_vkeys[_j].bottom) continue;
			tu_vkeys[_j].count++;
			if (!tu_vkeys[_j].down) {
				tu_vkeys[_j].down = true;
				_k = tu_vkeys[_j].key;
				if (!key_down[_k]) {
					key_down[_k] = true;
					key_pressed[_k] = true;
					tu_keys_pressed.push(_k);
				}
			}
			_c++;
		}
		if (_c == 0) {
			_tx += _t[_i].pageX;
			_ty += _t[_i].pageY;
			touch_x[_tc] = _t[_i].pageX;
			touch_y[_tc] = _t[_i].pageY;
			_tc++;
		}
	}
	for (_i = 0; _i < _vl; _i++) {
		if (tu_vkeys[_i].count != 0) continue;
		if (!tu_vkeys[_i].down) continue;
		tu_vkeys[_i].down = false;
		_k = tu_vkeys[_i].key;
		if (key_down[_k]) {
			key_down[_k] = false;
			key_released[_k] = true;
			tu_keys_released.push(_k);
		}
	}
	touch_count = _tc;
	if (_tc != 0) {
		mouse_x = (_tx / _tc) - _dx;
		mouse_y = (_ty / _tc) - _dy;
		if (!mouse_down) {
			mouse_down = true;
			mouse_pressed = true;
		}
	} else if (mouse_down) {
		mouse_down = false;
		mouse_released = true;
	}
};
function __touchlistener__(_e) {
	_e.preventDefault();
	__touchvkey__(_e.targetTouches);
};
//}
function tu_init () {
	if (document.addEventListener) {
		document.addEventListener("keydown", __keydownlistener__, false);
		document.addEventListener("keyup", __keyuplistener__, false);
		document.addEventListener("mousemove", __mousemovelistener__, false);
		document.addEventListener("mousedown", __mousedownlistener__, false);
		document.addEventListener("mouseup", __mouseuplistener__, false);
		document.addEventListener("touchstart", __touchlistener__, false);
		document.addEventListener("touchend", __touchlistener__, false);
		document.addEventListener("touchmove", __touchlistener__, false);
		document.addEventListener("touchenter", __touchlistener__, false);
		document.addEventListener("touchleave", __touchlistener__, false);
		document.addEventListener("touchcancel", __touchlistener__, false);
	} else {
		document.attachEvent("onkeydown", __keydownlistener__);
		document.attachEvent("onkeyup", __keyuplistener__);
		document.attachEvent("onmousemove", __mousemovelistener__);
		document.attachEvent("onmousedown", __mousedownlistener__);
		document.attachEvent("onmouseup", __mouseuplistener__);
	}
	// initialize keycodes
	for (var _k = 0; _k < 256; _k++) {
		key_down[_k] = key_pressed[_k] = key_released[_k] = false;
	}
}

function tu_loading_inc() { tu_loading++; tu_load_total++; }
function tu_loading_dec() { tu_loading--; }

function _$_(_id_) {
	return document.getElementById( _id_ );
}

var var_override_ = (Object.defineProperty != undefined);
function var_override(_what, _svar, _fget, _fset) {
	if (var_override_) {
		if (_what.hasOwnProperty(_svar)) return;
		Object.defineProperty(_what, _svar, {
			get: _fget,
			set: _fset
		});
	} else {
		if (_what.__lookupGetter__(_svar) != undefined) return;
		_what.__defineGetter__(_svar, _fget);
		_what.__defineSetter__(_svar, _fset);
	}
}

//{ Depth
function _tu_depth_find(_d) {
	var _tl = tu_depthi.length;
	var _td;
	for (var _ti = 0; _ti < _tl; _ti++)
	{
		_td = tu_depthi[_ti];
		if (_d > _td) return _ti;
	}
	return _tl;
}
function _tu_depth_new(_d) {
	var _i = _tu_depth_find(_d);
	var _o = [];
	tu_depth.splice(_i, 0, _o);
	tu_depthi.splice(_i, 0, _d);
	return _i;
}
function tu_depth_add(_d, _o) {
	var _t = tu_depthi.indexOf(_d);
	if (_t == -1) _t = _tu_depth_new(_d); // create array if none
	tu_depth[_t].push(_o);
}
function tu_depth_delete(_d, _o) {
	var _t = tu_depth[tu_depthi.indexOf(_d)];
	var _ti = _t.indexOf(_o);
	if (_ti == -1) return;
	_t.splice(_ti, 1);
}
// Accessors:
function tu_depth_get() { return this._depth; }
function tu_depth_set(_d) {
	if (this._depth == _d) return; // don't change on depth match
	if (this.instance_active && this._depth != undefined) tu_depth_delete(this._depth, this);
	this._depth = _d;
	if (this.instance_active && this._depth != undefined) tu_depth_add(this._depth, this);
}
//}
//{ Types
function instance_list(_o) {
	var _t = _o._object_index_;
	if (tu_types[_t] == undefined) tu_types[_t] = [];
	return tu_types[_t];
}
function tu_type_add(_d, _o) {
	instance_list(_d).push(_o);
}
function tu_type_delete(_o, _p) {
	var _d = tu_types[_p];
	var _t = _d.indexOf(_o);
	_d.splice(_t, 1);
}
function tu_type_get() { return this._object_index; }
//}
//{ Tileset functions
var tu_tiles = []; // object
var tu_tilesi = []; // index
var tu_tilez = 256;
function tile_layer_find(_d) {
	var _tl = tu_tilesi.length;
	var _td;
	for (var _ti = 0; _ti < _tl; _ti++) {
		_td = tu_tilesi[_ti];
		if (_d > _td) return _ti;
	}
	return _tl;
}
function tile_layer_add(_d) {
	var _i = tile_layer_find(_d);
	var _o = [];
	tu_tiles.splice(_i, 0, _o);
	tu_tilesi.splice(_i, 0, _d);
	return _o;
}
function tile(_s, _x, _y, _l, _t, _w, _h) {
	this.source = _s;
	this.x = _x;
	this.y = _y;
	this.left = _l;
	this.top = _t;
	this.width = _w;
	this.height = _h;
	this.width2 = _w;
	this.height2 = _h;
	this.sectors = [];
}
function tile_add(_b, _l, _t, _w, _h, _x, _y, _z) {
	var _tx1 = Math.floor(_x / tu_tilez);
	var _ty1 = Math.floor(_y / tu_tilez);
	var _tx2 = Math.floor((_x + _w) / tu_tilez);
	var _ty2 = Math.floor((_y + _h) / tu_tilez);
	var _tt = new tile(_b, _x, _y, _l, _t, _w, _h);
	var _tx, _ty, _ts;
	var _d, _e = tu_tilesi.indexOf(_z);
	if (_e != -1) _d = tu_tiles[_e];
	else _d = tile_layer_add(_z);
	for (_tx = _tx1; _tx <= _tx2; _tx++) {
		if (_d[_tx] == null) _d[_tx] = [];
		for (_ty = _ty1; _ty <= _ty2; _ty++) {
			if (_d[_tx][_ty] == null) _d[_tx][_ty] = [];
			_ts = _d[_tx][_ty];
			_ts.push(_tt);
			_tt.sectors.push(_ts);
		}
	}
	return _tt;
}
function tile_find(_x, _y, _w, _h, _d) {
	var _xw = _x + _w;
	var _yh = _y + _h;
	var _r = [];
	var _tx, _ty, _ti, _tl, _ts, _tt, _ta;
	_ti = tu_tilesi.indexOf(_d);
	if (_ti == -1) return _r;
	_ta = tu_tiles[_ti];
	var _tx1 = Math.floor(_x / tu_tilez);
	var _ty1 = Math.floor(_y / tu_tilez);
	var _tx2 = Math.floor((_x + _w) / tu_tilez);
	var _ty2 = Math.floor((_y + _h) / tu_tilez);
	for (_tx = _tx1; _tx <= _tx2; _tx++) {
		if (_ta[_tx] == null) continue;
		for (_ty = _ty1; _ty <= _ty2; _ty++) {
			if (_ta[_tx][_ty] == null) continue;
			_ts = _ta[_tx][_ty];
			_tl = _ts.length;
			for (_ti = 0; _ti < _tl; _ti++) {
				_tt = _ts[_ti];
				if (_tt.x >= _xw) continue;
				if (_tt.y >= _yh) continue;
				if (_tt.x + _tt.width2 < _x) continue;
				if (_tt.y + _tt.height2 < _y) continue;
				_r.push(_tt);
			}
		}
	}
	return _r;
}
function tile_delete(_t) {
	var _ti, _tl, _tt, _ts;
	_tl = _t.sectors.length;
	for (_ti = 0; _ti < _tl; _ti++)
	{
		_ts = _t.sectors[_ti];
		_ts.splice(_ts.indexOf(_t), 1);
	}
}
function tile_srender(_s) {
	var _ti, _tt;
	for (_ti = 0; _ti < _s.length; _ti++) {
		if (_s[_ti] == null) continue;
		_tt = _s[_ti];
		if (_tt.source == null) continue;
		if (_tt.source.image == null) continue;
		tu_context.drawImage(_tt.source.image, _tt.left, _tt.top, _tt.width, _tt.height, _tt.x - room_viewport_x, _tt.y - room_viewport_y, _tt.width2, _tt.height2);
	}
}
function tile_lrender(_l) {
	var _tx, _ty;
	var _tx1 = Math.floor(room_viewport_x / tu_tilez);
	var _tx2 = Math.floor((room_viewport_x + room_viewport_width) / tu_tilez);
	var _ty1 = Math.floor(room_viewport_y / tu_tilez);
	var _ty2 = Math.floor((room_viewport_y + room_viewport_height) / tu_tilez);
	for (_tx = _tx1; _tx <= _tx2; _tx++) {
		if (_l[_tx] == null) continue;
		for (_ty = _ty1; _ty <= _ty2; _ty++) {
			if (_l[_tx][_ty] == null) continue;
			tile_srender(_l[_tx][_ty]);
		}
	}
}
//} /Tileset functions
//{ Some events & get\set
function image_single_get() { return (this.image_speed == 0 ? this.image_index : -1); }
function image_single_set(_o) { this.image_speed = 0; this.image_index = _o; }
// Handles object size & sprite updates. Should get rid of this in favor of accessors.
function __handle_sprite__(_object_) {
	if (_object_.sprite_index == null) return;
	_object_.sprite_width = _object_.sprite_index.width;
	_object_.sprite_height = _object_.sprite_index.height;
	_object_.sprite_xoffset = _object_.sprite_index.xoffset;
	_object_.sprite_yoffset = _object_.sprite_index.yoffset;
	_object_.image_number = _object_.sprite_index.frames.length;
	_object_.image_index += _object_.image_speed;
	if (_object_.image_index >= _object_.image_number) _object_.image_index = _object_.image_index % _object_.image_number;
	if (_object_.image_index < 0) _object_.image_index = _object_.image_number - 1 + (_object_.image_index % _object_.image_number);
}
function __draw_self__() {
	draw_sprite_ext(this.sprite_index, this.image_index, this.x, this.y, this.image_xscale, this.image_yscale, this.image_angle, this.image_alpha);
}
//}
//{ Inherited event lookup functions.
// There's also a way to do this with much shorter code.
function on_creation_i() {
	for (var o = this.parent; o; o = o.parent)
	if (o.on_creation !== on_creation_i)
	return o.on_creation.apply(this);
}
function on_destroy_i() {
	for (var o = this.parent; o; o = o.parent)
	if (o.on_destroy !== on_destroy_i)
	return o.on_destroy.apply(this);
}
function on_step_i() {
	for (var o = this.parent; o; o = o.parent)
	if (o.on_step !== on_step_i)
	return o.on_step.apply(this);
}
function on_end_step_i() {
	for (var o = this.parent; o; o = o.parent)
	if (o.on_end_step !== on_end_step_i)
	return o.on_end_step.apply(this);
}
function on_draw_d() {
	__handle_sprite__(this);
	__draw_self__.apply(this);
}
function on_draw_i() {
	for (var o = this.parent; o; o = o.parent)
	if (o.on_draw !== on_draw_i)
	return o.on_draw.apply(this);
	on_draw_d.apply(this);
}
function on_collision_i() {
	for (var o = this.parent; o; o = o.parent)
	if (o.on_collision !== on_collision_i)
	return o.on_collision.apply(this);
}
function on_animationend_i() {
	for (var o = this.parent; o; o = o.parent)
	if (o.on_animationend !== on_animationend_i)
	return o.on_animationend.apply(this);
}
function on_roomstart_i() {
	for (var o = this.parent; o; o = o.parent)
	if (o.on_roomstart !== on_roomstart_i)
	return o.on_roomstart.apply(this);
}
function on_roomend_i() {
	for (var o = this.parent; o; o = o.parent)
	if (o.on_roomend !== on_roomend_i)
	return o.on_roomend.apply(this);
}
//} /Inherited event handles

// instance_init(this, object_index, parent_index, visible, depth, sprite, collideable, inner index)
// Universal object constructor:
function __instance_init__(_this, _oi, _p, _v, _d, _si, _c, _io) {
	_this._object_index = undefined;
	_this._object_index_ = _io;
	_this._depth = undefined;
	var_override(_this, 'depth', tu_depth_get, tu_depth_set );
	var_override(_this, 'object_index', tu_type_get, tu_idle );
	var_override(_this, 'image_single', image_single_get, image_single_set );
	_this.id = _this;
	_this._object_index = _oi;
	_this.parent = _p;
	_this.xstart = _this.xprevious = _this.x = 0;
	_this.ystart = _this.yprevious = _this.y = 0;
	_this.depthstart = _d;
	_this.image_angle = _this.direction = 0;
	_this.visible = _v;
	_this.image_yscale = _this.image_xscale = 1;
	_this.image_alpha = 1;
	_this.image_index = 0;
	_this.image_speed = 1;
	_this.sprite_index = _si;
	_this.speed = 0;
	_this.other = null;
	_this.collision_checking = _c;
	_this.persistent = false;
	_this.instance_active = false;
	// Instance-specific functions:
	_this.place_meeting = __place_meeting__;
	_this.move_towards_point = __move_towards_point__;
	_this.instance_destroy = __instance_destroy__;
	_this.draw_self = __draw_self__;
}
// Universal sprite constructor:
function __sprite_init__(_this, _name, _width, _height, _xofs, _yofs, _cshape, _crad, _cl, _cr, _ct, _cb, _frames) {
	_this.frames = [];
	var _frame;
	for (var _fi = 0; _fi < _frames.length; _fi++) {
		_frame = new Image();
		if (_frames[_fi]) {
			tu_loading_inc();
			_frame.onload = tu_loading_dec;
			_frame.onerror = tu_loading_dec;
			_frame.src = _frames[_fi];
		}
		_this.frames.push(_frame);
	}
	_this.width = _width;
	_this.height = _height;
	_this.xoffset = _xofs;
	_this.yoffset = _yofs;
	_this.collision_shape = _cshape;
	_this.collision_radius = _crad;
	_this.collision_left = _cl;
	_this.collision_right = _cr;
	_this.collision_top = _ct;
	_this.collision_bottom = _cb;
	tu_sprites.push(_this);
}
// Universal audio constructor:
function __audio_init__(_this, _name, _wav, _mp3, _ogg) {
	var _src = '';
	_this.type = 'none';
	if (tu_ogg_supported && (_ogg != '')) {
		_this.type = 'ogg';
		_src = _ogg;
	} else if (tu_mp3_supported && (_mp3 != '')) {
		_this.type = 'mp3';
		_src = _mp3;
	} else if (tu_wav_supported && (_wav != '')) {
		_this.type = 'wav';
		_src = _wav;
	}
	if (_src != '') {
		_this.audio = document.createElement('audio');
		_this.audio.setAttribute('src', _src);
	}
	tu_audios.push(_this);
}

function __background_init__(_this, _name, _file) {
	_this.image = new Image();
	tu_loading_inc();
	_this.image.onload = tu_loading_dec;
	_this.image.onerror = tu_loading_dec;
	_this.image.src = _file;
	tu_backgrounds.push(_this);
}

function __font_init__(_this, _name, _family, _size, _bold, _italic) {
	_this.family = _family;
	_this.size = _size;
	_this.bold = _bold;
	_this.italic = _italic;
	tu_fonts.push(_this);
}

// (this, name, width, height, speed, back. red, back. green, back. blue, background, back. tilex, back. tiley, back. stretch, view width, view height, view object, view hborder, view vborder)
function __room_start__(_this, _name, _rw, _rh, _rs, _br, _bg, _bb, _bi, _bx, _by, _bs, _vw, _vh, _vo, _vx, _vy) {
	_$_('tululoogame').innerHTML = "<canvas id='" + _name + "' width='" + _vw + "' height='" + _vh + "' style='" + tu_canvas_css + "'></canvas>";
	tu_canvas = _$_(_name);
	tu_context = tu_canvas.getContext('2d');
	room_current = _this;
	// generic:
	room_speed = _rs;
	room_width = _rw;
	room_height = _rh;
	// background color:
	room_background_color_red = _br;
	room_background_color_green = _bg;
	room_background_color_blue = _bb;
	// background image:
	room_background = _bi;
	room_background_x = 0;
	room_background_y = 0;
	room_background_tile_x = _bx;
	room_background_tile_y = _by;
	room_background_tile_stretch = _bs;
	// view:
	room_viewport_width = _vw;
	room_viewport_height = _vh;
	room_viewport_x = room_viewport_y = 0;
	room_viewport_object = _vo;
	room_viewport_hborder = _vx;
	room_viewport_vborder = _vy;
	// tiles:
	var _tls_ = _this.tiles; tu_tiles = []; tu_tilesi = [];
	for (var _l = 0; _l < _tls_.length; _l++)
	for (var _b = 1; _b < _tls_[_l].length; _b++)
	for (var _t = 1; _t < _tls_[_l][_b].length; _t++)
	tile_add(_tls_[_l][_b][0], _tls_[_l][_b][_t][0], _tls_[_l][_b][_t][1], _tls_[_l][_b][_t][2], _tls_[_l][_b][_t][3], _tls_[_l][_b][_t][4], _tls_[_l][_b][_t][5], _tls_[_l][0]);
	// objects:
	tu_depth = []; tu_depthi = []; tu_types = [];
	for (var _i = 0, _il = _this.objects.length; _i < _il; _i++) {
		instance_create_(_this.objects[_i][1], _this.objects[_i][2], _this.objects[_i][0]);
	}
	// persistent objects:
	for (var _t = 0, _l = tu_persist.length; _t < _l; _t++) instance_activate(tu_persist[_t]);
	instance_foreach(function(o) {
		if (tu_persist.indexOf(o) != -1) return;
		o.on_creation();
	});
	tu_persist = [];
	//
	instance_foreach(function(o) {
		o.on_roomstart();
	});
}

function tu_preloader() {
	var _w = Math.min(400, (tu_canvas.width * 0.6) >> 0), _h = 16;
	var _x = (tu_canvas.width - _w) >> 1, _y = (tu_canvas.height - _h) >> 1;
	var _p = (tu_load_total - tu_loading) / tu_load_total;
	var _s = "Loading resources: " + (tu_load_total - tu_loading) + "/" + (tu_load_total);
	tu_canvas.width = tu_canvas.width;
	tu_canvas.height = tu_canvas.height;
	tu_canvas.style.backgroundColor = "rgb(42, 42, 42)";
	tu_context.font = "italic 12px Verdana";
	tu_context.textAlign = "left";
	tu_context.textBaseline = "bottom";
	tu_context.fillStyle = tu_context.strokeStyle = "rgba(192, 192, 192, 1)";
	tu_context.fillRect(_x - 1, _y - 1, _w + 2, _h + 2);
	tu_context.fillStyle = tu_context.strokeStyle = "rgba(0, 0, 0, 1)";
	tu_context.fillRect(_x, _y, _w, _h);
	tu_context.fillStyle = tu_context.strokeStyle = "rgba(255, 255, 255, 1)";
	tu_context.fillRect(_x + 2, _y + 2, (_w - 4) * _p, _h - 4);
	tu_context.fillText(_s, _x, _y - 2);
}

function tu_render_back() {
	if (room_background == null) return;
	if (room_background_tile_stretch) {
		tu_context.drawImage(room_background, 0 - room_viewport_x, 0 - room_viewport_y, room_width, room_height);
		return;
	}
	var _bw = room_background.width;
	var _bh = room_background.height;
	var _bx = room_background_x;
	if (room_background_tile_x) { _bx = _bx < 0 ? _bw - _bx % _bw : _bx % _bw; }
	var _by = room_background_y;
	if (room_background_tile_y) { _bx = _by < 0 ? _bh - _by % _bh : _by % _bh; }
	//
	var _vx = room_viewport_x;
	var _vy = room_viewport_y;
	var _vw = room_viewport_width;
	var _vh = room_viewport_height;
	//
	var _x1 = room_background_tile_x ? Math.floor(_vx / _bw) * _bw - _bx : -_bx;
	var _x2 = room_background_tile_x ? Math.floor((_vx + _vw + _bw) / _bw) * _bw : _x1 + _bw;
	var _y1 = room_background_tile_y ? Math.floor(_vy / _bh) * _bh - _by : -_by;
	var _y2 = room_background_tile_y ? Math.floor((_vy + _vh + _bh) / _bh) * _bh : _y1 + _bh;
	for (var _ht = _x1; _ht < _x2; _ht += _bw)
	for (var _vt = _y1; _vt < _y2; _vt += _bh)
	tu_context.drawImage(room_background, _ht - _vx, _vt - _vy);
}
// @1.2.6
function instance_activate(_i) {
	if (_i.instance_active) return;
	tu_type_add(_i._object_index, _i);
	if (_i.parent != null) tu_type_add(_i.parent, _i);
	tu_depth_add(_i._depth, _i);
	_i.instance_active = true;
}
// @1.2.6
function instance_deactivate(_i) {
	if (!_i.instance_active) return;
	tu_type_delete(_i, _i._object_index_);
	if (_i.parent != null) tu_type_delete(_i, _i.parent._object_index_);
	tu_depth_delete(_i._depth, _i);
	_i.instance_active = false;
}
// @1.2.6 Performs function for all instances
function instance_foreach(_function) {
	for (var _d in tu_depth) {
		var _l = tu_depth[_d];
		for (var _o = 0; _o < _l.length; _o++) _function(_l[_o]);
	}
}
// @1.2.6 Performs function for all instances on specific depth
function instance_fordepth(_depth, _function) {
	var _d = tu_depthc[_depth];
	if (_d == null) return;
	for (var _o = 0, _l = _d.length; _o < _l; _o++) _function(_d[_o]);
}
// @1.2.6 Actions performed on room switch
function tu_room_switchto_(_o) {
	_o.on_roomend();
	if (!_o.persistent) return;
	tu_persist.push(_o);
	instance_deactivate(_o);
}
function tu_room_switchto(_dest) {
	tu_persist = [];
	instance_foreach(tu_room_switchto_);
	room_current = _dest;
	tu_room_to_go = null;
	room_current.start();
}
// @1.0.0 Global step event
function tu_step() {
	// object step events:
	tu_trash = [];
	for (tu_depthd in tu_depth) {
		tu_depthc = tu_depth[tu_depthd];
		for (var tu_deptho = 0, tu_depthl = tu_depthc.length; tu_deptho < tu_depthl; tu_deptho++) {
			var _obj_ = tu_depthc[tu_deptho];
			// is viewport object?
			if (room_viewport_object != null && tu_viewport_inst == null && (_obj_.object_index == room_viewport_object || _obj_.parent == room_viewport_object)) {
				tu_viewport_inst = _obj_;
			}
			// step events:
			_obj_.on_step();
			// move object:
			if (_obj_.speed != 0) {
				var _objd_ = _obj_.direction * tu_d2r;
				_obj_.x += _obj_.speed * Math.cos(_objd_);
				_obj_.y += _obj_.speed * Math.sin(_objd_);
			}
			// post-step events:
			_obj_.on_collision();
			_obj_.on_end_step();
			// post:
			_obj_.xprevious = _obj_.x;
			_obj_.yprevious = _obj_.y;
		}
	}
	// follow object
	if (tu_viewport_inst != null) {
		var _h = min(room_viewport_hborder, room_viewport_width / 2);
		var _v = min(room_viewport_vborder, room_viewport_height / 2);
		// hborder:
		if (tu_viewport_inst.x < room_viewport_x + _h) room_viewport_x = tu_viewport_inst.x - _h;
		if (tu_viewport_inst.x > room_viewport_x + room_viewport_width - _h) room_viewport_x = tu_viewport_inst.x - room_viewport_width + _h;
		// vborder:
		if (tu_viewport_inst.y < room_viewport_y + _v) room_viewport_y = tu_viewport_inst.y - _v;
		if (tu_viewport_inst.y > room_viewport_y + room_viewport_height - _v) room_viewport_y = tu_viewport_inst.y - room_viewport_height + _v;
		// limits:
		room_viewport_x = Math.max(0, Math.min(room_viewport_x, room_width - room_viewport_width)) >> 0;
		room_viewport_y = Math.max(0, Math.min(room_viewport_y, room_height - room_viewport_height)) >> 0;
	}
}

function tu_draw() {
	// clear canvas:
	if (room_background_color_show) {
		tu_canvas.width = tu_canvas.width;
		tu_canvas.height = tu_canvas.height;
		// set background color:
		tu_canvas.style.backgroundColor = "rgb(" + room_background_color_red + "," + room_background_color_green + "," + room_background_color_blue + ")";
	}
	tu_render_back();
	tile_layer_last = 0;
	for (tu_depthd in tu_depth) {
		tu_depthc = tu_depth[tu_depthd];
		tu_depthv = tu_depthi[tu_depthd];
		for (; tu_tilesi[tile_layer_last] >= tu_depthv && tile_layer_last < tu_tiles.length; tile_layer_last++)
		{
			tile_lrender(tu_tiles[tile_layer_last]);
		}
		for (var tu_deptho = 0, tu_depthl = tu_depthc.length; tu_deptho < tu_depthl; tu_deptho++) {
			var _obj_ = tu_depthc[tu_deptho];
			_obj_.on_draw();
			_obj_.on_animationend();
		}
	}
	// render remaining tile layers:
	for (; tile_layer_last < tu_tiles.length; tile_layer_last++) {
		tile_lrender(tu_tiles[tile_layer_last]);
	}
}

function tu_prestep() {
	// clear mouse states and keypressed / keyrelesed statuses
	mouse_pressed = false;
	mouse_released = false;
	for (var _k = 0; _k < tu_keys_pressed.length; _k++) key_pressed[tu_keys_pressed[_k]] = false;
	for (var _k = 0; _k < tu_keys_released.length; _k++) key_released[tu_keys_released[_k]] = false;
	tu_keys_pressed = [];
	tu_keys_released = [];
	// remove objects from destroy stack
	for (var _r = 0; _r < tu_trash.length; _r++) {
		var _obj_ = tu_trash[_r];
		if (tu_modal == _obj_) tu_modal = null;
		_obj_.depth = undefined;
		tu_type_delete(_obj_, _obj_._object_index_);
		if (_obj_.parent != null) tu_type_delete(_obj_, _obj_.parent._object_index_);
		_obj_.on_destroy();
	}
}

function tu_loop() {
	// calculate render time
	tu_frame_time = tu_gettime();
	tu_elapsed = (tu_frame_time - tu_prev_frame_time);
	tu_frame_step += tu_elapsed;
	tu_frame_el += tu_elapsed;
	// continue game with the UN-Pause key
	if (tu_paused && keyboard_check_pressed(tu_unpausekey)) tu_paused = false;
	//
	if (tu_room_to_go != null && tu_canvas == null) tu_room_switchto(tu_room_to_go);
	// render game:
	if (tu_frame_step >= 1000 / room_speed && tu_loading == 0 && tu_canvas != null && !tu_paused) {
		tu_frame_count++;
		tu_elapsed = tu_frame_time - tu_prev_cycle_time;
		tu_prev_cycle_time = tu_frame_time;
		tu_frame_step -= 1000 / room_speed;
		if (tu_frame_step < 0 || tu_frame_step > 1024) tu_frame_step = 0;
		// start next room, if any:
		if (tu_room_to_go != null) tu_room_switchto(tu_room_to_go);
		//
		tu_redraw = tu_redraw_auto;
		if (tu_modal != null) {
			tu_modal.on_step();
			if (tu_modal != null) {
				tu_modal.on_end_step();
			}
		} else tu_step();
		if (tu_redraw) {
			if (tu_modal == null || tu_modaldraw) tu_draw();
			else {
				tu_modal.on_draw();
			}
		}
		tu_prestep();
	} else if (tu_loading > 0) tu_preloader();
	// calculate fps:
	if (tu_frame_el >= Math.floor(200 / room_speed) * 5 * room_speed)
	{
		fps = Math.ceil(tu_frame_count * 1000 / tu_frame_el);
		if (fps > room_speed) fps = room_speed;
		tu_frame_el = tu_frame_count = 0;
	}
	// repeat
	tu_prev_frame_time = tu_frame_time;
	setTimeout(__gameloop__, 5);
}
tu_init();

/***********************************************************************
 * EXTENSIONS
 ***********************************************************************/


/***********************************************************************
 * SPRITES
 ***********************************************************************/
function __spr_player() { 
__sprite_init__(this, spr_player, 20, 40, 10, 40, 'Box', 10, 0, 20, 2, 40, ['spr_player_0.png']);
}; var spr_player = new __spr_player();

function __spr_ground() { 
__sprite_init__(this, spr_ground, 40, 40, 0, 0, 'Box', 20, 0, 40, 0, 40, ['spr_ground_0.png']);
}; var spr_ground = new __spr_ground();

function __spr_diamond() { 
__sprite_init__(this, spr_diamond, 10, 10, 5, 5, 'Box', 5, 0, 10, 0, 10, ['spr_diamond_0.png','spr_diamond_1.png','spr_diamond_2.png','spr_diamond_3.png','spr_diamond_4.png','spr_diamond_5.png','spr_diamond_6.png','spr_diamond_7.png','spr_diamond_8.png','spr_diamond_9.png']);
}; var spr_diamond = new __spr_diamond();

function __spr_bullet() { 
__sprite_init__(this, spr_bullet, 8, 8, 4, 4, 'Circle', 4, 0, 8, 0, 8, ['spr_bullet_0.png']);
}; var spr_bullet = new __spr_bullet();

function __spr_box() { 
__sprite_init__(this, spr_box, 40, 40, 0, 0, 'Box', 20, 0, 40, 0, 40, ['spr_box_0.png']);
}; var spr_box = new __spr_box();

function __spr_piece() { 
__sprite_init__(this, spr_piece, 11, 11, 5, 5, 'Circle', 5, 0, 11, 0, 11, ['spr_piece_0.png']);
}; var spr_piece = new __spr_piece();

function __spr_cloud() { 
__sprite_init__(this, spr_cloud, 187, 60, 93, 30, 'Box', 93, 0, 187, 0, 60, ['spr_cloud_0.png']);
}; var spr_cloud = new __spr_cloud();



/***********************************************************************
 * SOUNDS
 ***********************************************************************/
function __snd_bullet() { 
__audio_init__(this, snd_bullet, 'hit05.wav', '', '');
}; var snd_bullet = new __snd_bullet();

function __snd_boxhit() { 
__audio_init__(this, snd_boxhit, 'explosion06.wav', '', '');
}; var snd_boxhit = new __snd_boxhit();

function __snd_jump() { 
__audio_init__(this, snd_jump, 'coin06.wav', '', '');
}; var snd_jump = new __snd_jump();

function __snd_diamond() { 
__audio_init__(this, snd_diamond, 'coin01.wav', '', '');
}; var snd_diamond = new __snd_diamond();



/***********************************************************************
 * MUSICS
 ***********************************************************************/


/***********************************************************************
 * BACKGROUNDS
 ***********************************************************************/
function __background_clouds() { 
__background_init__(this, background_clouds, 'cloudy.png')}; var background_clouds = new __background_clouds();



/***********************************************************************
 * FONTS
 ***********************************************************************/


/***********************************************************************
 * OBJECTS
 ***********************************************************************/
function __obj_player() {
__instance_init__(this, obj_player, null, 1, 0, spr_player, 1, 0);
this.on_creation = function() {
with(this) {
this.air = 0;
this.jump = 0;
}
};
this.on_destroy = on_destroy_i;
this.on_step = function() {
with(this) {
if ( keyboard_check(vk_right) ) {
	x += 4;
	direction = 0;
	if (place_meeting(x, y, obj_ground) != null || place_meeting(x, y, obj_box) != null) {
		x = xprevious;
	}
}

if ( keyboard_check(vk_left) ) {
	x -= 4;
	direction = 180;
	if (place_meeting(x, y, obj_ground) != null || place_meeting(x, y, obj_box) != null) {
		x = xprevious;
	}

}

if ( keyboard_check_pressed(vk_up) && jump == 0 ) {
	jump = 1;
	air = 9;
	sound_play(snd_jump);
}

if ( air > -5 ) air -= 0.5;

y -= air;

if ( place_meeting(x, y, obj_ground) != null  || place_meeting(x, y, obj_box) != null ) {
	y = yprevious;
	air = 0;
	jump = 0;
}

if (keyboard_check_pressed(vk_space)) {
	bullet = instance_create(x,y - 25,obj_bullet);
	bullet.direction = direction;
	bullet.speed = 15;
}

if ( x < 0 ) x = 0;
if ( x > room_width ) x = room_width;
}
};
this.on_end_step = on_end_step_i;
this.on_collision = on_collision_i;
this.on_roomstart = on_roomstart_i;
this.on_roomend = on_roomend_i;
this.on_animationend = on_animationend_i;
this.on_draw = on_draw_i;
}; var obj_player = new __obj_player();

function __obj_ground() {
__instance_init__(this, obj_ground, null, 1, 0, spr_ground, 1, 1);
this.on_creation = on_creation_i;
this.on_destroy = on_destroy_i;
this.on_step = on_step_i;
this.on_end_step = on_end_step_i;
this.on_collision = on_collision_i;
this.on_roomstart = on_roomstart_i;
this.on_roomend = on_roomend_i;
this.on_animationend = on_animationend_i;
this.on_draw = on_draw_i;
}; var obj_ground = new __obj_ground();

function __obj_diamond() {
__instance_init__(this, obj_diamond, null, 1, 0, spr_diamond, 1, 68);
this.on_creation = on_creation_i;
this.on_destroy = on_destroy_i;
this.on_step = on_step_i;
this.on_end_step = on_end_step_i;
this.on_collision = function() {
with(this) {
this.other = this.place_meeting(this.x, this.y, obj_player);
if(this.other != null) {
instance_destroy();
sound_play(snd_diamond);
}
}
};
this.on_roomstart = on_roomstart_i;
this.on_roomend = on_roomend_i;
this.on_animationend = on_animationend_i;
this.on_draw = on_draw_i;
}; var obj_diamond = new __obj_diamond();

function __obj_bullet() {
__instance_init__(this, obj_bullet, null, 1, 0, spr_bullet, 1, 111);
this.on_creation = function() {
with(this) {
sound_play(snd_bullet);
}
};
this.on_destroy = on_destroy_i;
this.on_step = function() {
with(this) {
if (x < 0 || x > room_width) instance_destroy();
}
};
this.on_end_step = on_end_step_i;
this.on_collision = function() {
with(this) {
this.other = this.place_meeting(this.x, this.y, obj_ground);
if(this.other != null) {
instance_destroy();
}
}
};
this.on_roomstart = on_roomstart_i;
this.on_roomend = on_roomend_i;
this.on_animationend = on_animationend_i;
this.on_draw = on_draw_i;
}; var obj_bullet = new __obj_bullet();

function __obj_box() {
__instance_init__(this, obj_box, null, 1, 0, spr_box, 1, 112);
this.on_creation = on_creation_i;
this.on_destroy = function() {
with(this) {
for (t = 0; t < 10; t++) {
	instance_create(x,y,obj_piece);
}
}
};
this.on_step = on_step_i;
this.on_end_step = on_end_step_i;
this.on_collision = function() {
with(this) {
this.other = this.place_meeting(this.x, this.y, obj_bullet);
if(this.other != null) {
instance_destroy();
sound_play(snd_boxhit);
with (other) {
	instance_destroy();
}
}
}
};
this.on_roomstart = on_roomstart_i;
this.on_roomend = on_roomend_i;
this.on_animationend = on_animationend_i;
this.on_draw = on_draw_i;
}; var obj_box = new __obj_box();

function __obj_piece() {
__instance_init__(this, obj_piece, null, 1, 0, spr_piece, 1, 131);
this.on_creation = function() {
with(this) {
speed = irandom(2) + 2;
direction = irandom(360);
this.air = 0;
image_angle = direction;
}
};
this.on_destroy = on_destroy_i;
this.on_step = function() {
with(this) {
y += air;
air += 0.4;
image_angle += air;
}
};
this.on_end_step = on_end_step_i;
this.on_collision = function() {
with(this) {
this.other = this.place_meeting(this.x, this.y, obj_ground);
if(this.other != null) {
instance_destroy();
}
}
};
this.on_roomstart = on_roomstart_i;
this.on_roomend = on_roomend_i;
this.on_animationend = on_animationend_i;
this.on_draw = on_draw_i;
}; var obj_piece = new __obj_piece();

function __obj_cloud() {
__instance_init__(this, obj_cloud, null, 1, 100, spr_cloud, 1, 132);
this.on_creation = function() {
with(this) {
speed = 1;
direction = 180;
}
};
this.on_destroy = on_destroy_i;
this.on_step = function() {
with(this) {
if (x < -250 ) x = room_width + 250;
}
};
this.on_end_step = on_end_step_i;
this.on_collision = on_collision_i;
this.on_roomstart = on_roomstart_i;
this.on_roomend = on_roomend_i;
this.on_animationend = on_animationend_i;
this.on_draw = on_draw_i;
}; var obj_cloud = new __obj_cloud();



/***********************************************************************
 * SCENES
 ***********************************************************************/
function __level1() { 
this.tiles = [
];
this.objects = [
[obj_ground,0,240],
[obj_ground,40,240],
[obj_ground,80,240],
[obj_ground,120,240],
[obj_ground,160,240],
[obj_ground,200,240],
[obj_ground,240,240],
[obj_ground,280,240],
[obj_ground,320,240],
[obj_ground,360,240],
[obj_ground,400,240],
[obj_ground,440,240],
[obj_ground,480,240],
[obj_ground,520,240],
[obj_ground,560,240],
[obj_ground,600,240],
[obj_ground,640,240],
[obj_ground,680,240],
[obj_ground,720,240],
[obj_ground,760,240],
[obj_ground,800,240],
[obj_ground,840,240],
[obj_ground,880,240],
[obj_ground,920,240],
[obj_ground,960,240],
[obj_ground,1000,240],
[obj_ground,1040,240],
[obj_ground,1080,240],
[obj_ground,1120,240],
[obj_ground,1160,240],
[obj_ground,1200,240],
[obj_ground,1240,240],
[obj_ground,1280,240],
[obj_ground,1320,240],
[obj_ground,1360,240],
[obj_ground,1400,240],
[obj_ground,1440,240],
[obj_ground,1480,240],
[obj_ground,1520,240],
[obj_ground,1560,240],
[obj_ground,280,160],
[obj_ground,320,160],
[obj_ground,360,160],
[obj_ground,600,120],
[obj_ground,640,120],
[obj_ground,680,120],
[obj_ground,800,160],
[obj_ground,760,160],
[obj_ground,960,200],
[obj_ground,1000,160],
[obj_ground,1040,120],
[obj_ground,1080,120],
[obj_ground,1120,120],
[obj_ground,1160,120],
[obj_ground,1200,140],
[obj_ground,440,200],
[obj_ground,520,160],
[obj_ground,1300,180],
[obj_ground,1480,100],
[obj_ground,1280,80],
[obj_ground,1320,60],
[obj_ground,1400,60],
[obj_ground,1440,60],
[obj_ground,1520,200],
[obj_ground,1560,160],
[obj_player,120,240],
[obj_diamond,300,140],
[obj_diamond,380,140],
[obj_diamond,620,100],
[obj_diamond,320,100],
[obj_diamond,360,100],
[obj_diamond,700,100],
[obj_diamond,640,60],
[obj_diamond,680,60],
[obj_diamond,780,120],
[obj_diamond,800,120],
[obj_diamond,820,120],
[obj_diamond,780,140],
[obj_diamond,800,140],
[obj_diamond,820,140],
[obj_diamond,1060,180],
[obj_diamond,1080,180],
[obj_diamond,1100,180],
[obj_diamond,1120,180],
[obj_diamond,1120,200],
[obj_diamond,1100,200],
[obj_diamond,1080,200],
[obj_diamond,1060,200],
[obj_diamond,1060,220],
[obj_diamond,1080,220],
[obj_diamond,1100,220],
[obj_diamond,1120,220],
[obj_diamond,1340,100],
[obj_diamond,1500,80],
[obj_diamond,1340,40],
[obj_diamond,1360,40],
[obj_diamond,1400,40],
[obj_diamond,1460,40],
[obj_diamond,1440,40],
[obj_diamond,1420,40],
[obj_diamond,1380,40],
[obj_diamond,1580,140],
[obj_diamond,1540,140],
[obj_diamond,1200,100],
[obj_diamond,1160,100],
[obj_diamond,1120,100],
[obj_diamond,1060,100],
[obj_ground,1340,200],
[obj_box,320,120],
[obj_box,520,120],
[obj_box,1140,200],
[obj_box,1140,160],
[obj_box,1180,200],
[obj_box,1340,160],
[obj_box,1340,120],
[obj_box,1520,160],
[obj_box,1060,80],
[obj_box,1060,40],
[obj_box,720,200],
[obj_box,720,160],
[obj_box,680,160],
[obj_box,680,200],
[obj_box,900,200],
[obj_box,860,200],
[obj_box,860,160],
[obj_box,900,160],
[obj_cloud,260,140],
[obj_cloud,580,40],
[obj_cloud,1280,120],
[obj_cloud,1560,20]];
this.start = function() {
__room_start__(this, level1, 1600, 272, 60, 0, 0, 0, background_clouds.image, 1, 0, 0, 480, 272, obj_player, 230, 0);
};
}
var level1 = new __level1();
tu_scenes.push(level1);
tu_room_to_go = level1;


/***********************************************************************
 * CUSTOM GLOBAL VARIABLES
 ***********************************************************************/


/***********************************************************************
 * CUSTOM GLOBAL FUNCTIONS
 ***********************************************************************/


var __gameloop__ = tu_loop;
tu_loop();
