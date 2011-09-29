/** @class Various helper methods for manipulating XML files */
jsmake.Xml = {
	/**
	 * Search nodes that match XPath in XML file.
	 * @param {String} file XML file path
	 * @param {String} xpath XPath query to search for
	 * @returns {String[]} an array of values of matching nodes
	 * @example
	 * var values = jsmake.Xml.getValues('temp/file.xml', '//series/season/episode/text()');
	 */
	getValues: function (file, xpath) {
		var i, ret = [], nodeList;
		nodeList = this._getNodeList(this._loadDocument(file), xpath);
		for (i = 0; i < nodeList.getLength(); i += 1) {
			ret.push(jsmake.Rhino.translateJavaString(nodeList.item(i).getNodeValue()));
		}
		return ret;
	},
	/**
	 * Like {@link jsmake.Xml.getValues}, but expect a single match, throwing exception otherwise.
	 * @param {String} file XML file path
	 * @param {String} xpath XPath query to search for
	 * @returns {String} value of matching node
	 * @example
	 * var episode = jsmake.Xml.getValue('temp/file.xml', '//series/season[@id="1"]/episode/text()');
	 */
	getValue: function (file, xpath) {
		var values = this.getValues(file, xpath);
		if (values.length !== 1) {
			throw "Unable to find a single element for xpath '" + xpath + "' in file '" + file + "'";
		}
		return values[0];
	},
	/**
	 * Set value of matching node in XML file. throw exception if multiple nodes match XPath.
	 * @param {String} file XML file path
	 * @param {String} xpath XPath query to search for
	 * @param {String} value value to set
	 * @example
	 * jsmake.Xml.setValue('temp/file.xml', '//series/season[@id="1"]/episode', 'new episode value');
	 */
	setValue: function (file, xpath, value) {
		var nodeList, document;
		document = this._loadDocument(file);
		nodeList = this._getNodeList(document, xpath);
		if (nodeList.getLength() !== 1) {
			throw "Unable to find a single element for xpath '" + xpath + "' in file '" + file + "'";
		}
		nodeList.item(0).setTextContent(value);
		this._saveDocument(document, file);
	},
	_getNodeList: function (document, xpath) {
		return javax.xml.xpath.XPathFactory.newInstance().newXPath().evaluate(xpath, document, javax.xml.xpath.XPathConstants.NODESET);
	},
	_loadDocument: function (file) {
		var documentBuilderFactory, document;
		documentBuilderFactory = javax.xml.parsers.DocumentBuilderFactory.newInstance();
		documentBuilderFactory.setNamespaceAware(true);
		document = documentBuilderFactory.newDocumentBuilder().parse(file);
		return document;
	},
	_saveDocument: function (document, file) {
		var transformer;
		transformer = javax.xml.transform.TransformerFactory.newInstance().newTransformer();
		transformer.transform(new javax.xml.transform.dom.DOMSource(document), new javax.xml.transform.stream.StreamResult(new java.io.File(file)));
	}
};
