/*global window, history, document, Event, XMLHttpRequest*/
(function (window, history, document, Event, XMLHttpRequest) {
  "use strict";

  function wrapper(type) {
    var orig = history[type];
    return function () {
      var rv = orig.apply(this, arguments),
        e = new Event(type);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return rv;
    };
  }

  function renderHTML() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      document.querySelector(".container[role=main]").innerHTML = this.responseText;
    }
  }

  function handleUrlChange() {
    var url = "/html" + window.location.pathname, httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', url, true);
    httpRequest.onreadystatechange = renderHTML;
    httpRequest.send();
  }

  function handleClick(evt) {
    if (evt.target && evt.target.nodeName === 'A' && evt.button === 0) {
      history.pushState(null, null, evt.srcElement.pathname);
      evt.preventDefault();
    }
  }

  history.pushState = wrapper('pushState');
  history.replaceState = wrapper('replaceState');

  // Update page when back() or forward() is triggered
  window.onpopstate = handleUrlChange;
  window.addEventListener('pushState', handleUrlChange);
  window.addEventListener('replaceState', handleUrlChange);

  document.addEventListener("DOMContentLoaded", function () {
    var i, aList = document.getElementsByTagName("a");
    for (i = 0; i < aList.length; i += 1) {
      aList[i].addEventListener("click", handleClick, false);
    }
  });

}(window, window.history, document, Event, XMLHttpRequest));
