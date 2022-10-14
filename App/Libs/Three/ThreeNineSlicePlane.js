/**
 * 9-slice плоскость в 3d
 *
 */


THREE.ThreeNineSlicePlane = function (texture, options) {

	const DEFAULT_BORDER_SIZE = 15;

	let params = {
		name: 'nine slice plane',

		leftWidth: DEFAULT_BORDER_SIZE,
		topHeight: DEFAULT_BORDER_SIZE,
		rightWidth: DEFAULT_BORDER_SIZE,
		bottomHeight: DEFAULT_BORDER_SIZE,

		position: [0, 0, 0],
		rotation: [0, 0, 0],
		scale: [1, 1, 1],
		bodyScale: [1, 1],
		width: undefined,
		height: undefined,

		color: 0xffffff,
		alphaMap: null,
		transparent: true,
		opacity: 1,
		visible: true
	};
	// params = {...params, ...options};
	Object.assign(params, options);

	this._leftWidth = params.leftWidth;
	this._topHeight = params.topHeight;
	this._rightWidth = params.rightWidth;
	this._bottomHeight = params.bottomHeight;
	this.visible = params.visible;

	const material = new THREE.MeshBasicMaterial({
		// color: 0x00ff00,
		map: texture,
		alphaMap: params.alphaMap,
		transparent: params.transparent,
		opacity: params.opacity
	});

	this._origWidth = material.map.image.width;
	this._origHeight = material.map.image.height;

	this._width = params.width !== undefined ? params.width : this._origWidth;
	this._height = params.height !== undefined ? params.height : this._origHeight;
	// this._size = [this._width, this._height];

	if (!Array.isArray(params.bodyScale)) params.bodyScale = new Array(params.bodyScale, params.bodyScale);
	this._bodyScale = params.bodyScale.slice();

	const geometry = new THREE.PlaneBufferGeometry(1, 1, 3, 3);

	THREE.Mesh.call(this, geometry, material);

	this.position.set(params.position[0], params.position[1], params.position[2]);
	this.rotation.set(params.rotation[0], params.rotation[1], params.rotation[2]);

	if (!Array.isArray(params.scale)) params.scale = new Array(params.scale, params.scale);
	this.scale.set(params.scale[0], params.scale[1], 1);

	// this.params = {...params, ...{size: this._size}};
	// this.params = {...params};
	this.params = params;
	this.name = this.params.name;


	this._refresh();

};

THREE.ThreeNineSlicePlane.prototype = Object.create(THREE.Mesh.prototype);
THREE.ThreeNineSlicePlane.prototype.constructor = THREE.ThreeNineSlicePlane;

THREE.ThreeNineSlicePlane.prototype._refresh = function () {

	const _uvw = 1 / this._origWidth;
	const _uvh = 1 / this._origHeight;

	const verts = this.geometry.attributes.position;
	const uvs = this.geometry.attributes.uv;

	let left = -this._width / 2 * this._bodyScale[0];
	let right = this._width / 2 * this._bodyScale[0];
	let top = this._height / 2 * this._bodyScale[1];
	let bottom = -this._height / 2 * this._bodyScale[1];

	let _vl = left + this._leftWidth * this._bodyScale[0];
	let _vr = right - this._rightWidth * this._bodyScale[0];
	let _vt = top - this._topHeight * this._bodyScale[1];
	let _vb = bottom + this._bottomHeight * this._bodyScale[1];

	let _uvl = _uvw * this._leftWidth;
	let _uvr = 1 - (_uvw * this._rightWidth);
	let _uvt = 1 - (_uvh * this._topHeight);
	let _uvb = _uvh * this._bottomHeight;

	// console.log(11, this._origWidth, this._origHeight, this._leftWidth, this._rightWidth, this._topHeight, this._bottomHeight, _uvl, _uvr, _uvt, _uvb, left, right, top, bottom)

	verts.setXY(0, left, top);
	verts.setXY(1, _vl, top);
	verts.setXY(2, _vr, top);
	verts.setXY(3, right, top);

	verts.setXY(4, left, _vt);
	verts.setXY(5, _vl, _vt);
	verts.setXY(6, _vr, _vt);
	verts.setXY(7, right, _vt);

	verts.setXY(8, left, _vb);
	verts.setXY(9, _vl, _vb);
	verts.setXY(10, _vr, _vb);
	verts.setXY(11, right, _vb);

	verts.setXY(12, left, bottom);
	verts.setXY(13, _vl, bottom);
	verts.setXY(14, _vr, bottom);
	verts.setXY(15, right, bottom);


	uvs.setXY(0, 0, 1);
	uvs.setXY(1, _uvl, 1);
	uvs.setXY(2, _uvr, 1);
	uvs.setXY(3, 1, 1);

	uvs.setXY(4, 0, _uvt);
	uvs.setXY(5, _uvl, _uvt);
	uvs.setXY(6, _uvr, _uvt);
	uvs.setXY(7, 1, _uvt);

	uvs.setXY(8, 0, _uvb);
	uvs.setXY(9, _uvl, _uvb);
	uvs.setXY(10, _uvr, _uvb);
	uvs.setXY(11, 1, _uvb);

	uvs.setXY(12, 0, 0);
	uvs.setXY(13, _uvl, 0);
	uvs.setXY(14, _uvr, 0);
	uvs.setXY(15, 1, 0);


	verts.needsUpdate = true;
	uvs.needsUpdate = true;

};


Object.defineProperty(THREE.ThreeNineSlicePlane.prototype, 'width', {
	get() {
		return this._width;
	},
	set(val) {
		this._width = val / this._bodyScale[0];
		// this._size[0] = val;
		this._refresh();
	}
});

Object.defineProperty(THREE.ThreeNineSlicePlane.prototype, 'height', {
	get() {
		return this._height;
	},
	set(val) {
		this._height = val / this._bodyScale[1];
		// this._size[1] = val;
		this._refresh();
	}
});

Object.defineProperty(THREE.ThreeNineSlicePlane.prototype, 'bodyScale', {
	get() {
		return this._bodyScale;
	},
	set(val) {
		if (!Array.isArray(val)) val = new Array(val, val);
		this._bodyScale = val;
		this._refresh();
	}
});

