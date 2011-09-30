/*global Make, describe, beforeEach, afterEach, expect, it, spyOn */

describe("jsmake.Xml", function () {
	var target, jsmake = { Xml: require('jsmake/Xml').Xml, Fs: require('jsmake/Fs').Fs };

	beforeEach(function () {
		var xml;

		target = jsmake.Xml;
		jsmake.Fs.createDirectory('temp');
		xml = [];
		xml.push('<?xml version="1.0" encoding="utf-8"?>');
		xml.push('<series name="futurama">');
		xml.push('  <season id="1">');
		xml.push('    <episode>Pilota spaziale 3000</episode>');
		xml.push('  </season>');
		xml.push('  <season id="2">');
		xml.push('    <episode>Il chip delle emozioni</episode>');
		xml.push('  </season>');
		xml.push('</series>');
		jsmake.Fs.writeFile('temp/file.xml', xml.join('\n'), 'UTF-8');
	});

	afterEach(function () {
		jsmake.Fs.deletePath('temp');
	});

	it('should get values', function () {
		var actual;
		
		actual = target.getValues('temp/file.xml', '//series/season/@id');
		expect(actual).toEqual([ '1', '2' ]);

		actual = target.getValues('temp/file.xml', '//series/season/episode/text()');
		expect(actual).toEqual([ 'Pilota spaziale 3000', 'Il chip delle emozioni' ]);
	});

	it('should fail when not exactly one value found', function () {
		expect(function () {
			target.getValue('temp/file.xml', '//series/notfound');
		}).toThrow("Unable to find a single element for xpath '//series/notfound' in file 'temp/file.xml'");

		expect(function () {
			target.getValue('temp/file.xml', '//series/season/@id');
		}).toThrow("Unable to find a single element for xpath '//series/season/@id' in file 'temp/file.xml'");
	});

	it('should change value', function () {
		var actual;

		actual = target.getValue('temp/file.xml', '//series/season[@id="1"]/episode/text()');
		expect(actual).toEqual('Pilota spaziale 3000');

		target.setValue('temp/file.xml', '//series/season[@id="1"]/episode', 'changed');
		actual = target.getValue('temp/file.xml', '//series/season[@id="1"]/episode/text()');
		expect(actual).toEqual('changed');
	});

	it('should fail when trying to set multiple nodes or no node found', function () {
		expect(function () {
			target.setValue('temp/file.xml', '//series/notfound');
		}).toThrow("Unable to find a single element for xpath '//series/notfound' in file 'temp/file.xml'");

		expect(function () {
			target.setValue('temp/file.xml', '//series/season/episode');
		}).toThrow("Unable to find a single element for xpath '//series/season/episode' in file 'temp/file.xml'");
	});
});
