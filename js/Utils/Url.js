// Generated by CoffeeScript 1.10.0
(function () {
  this.Url = (function () {
    var load

    function Url () {}

    load = function (url, params, cb, method, async) {
      var hash, ret, z
      if ($('#loadingbar').length === 0) {
        $('body').append('<div id=\'loadingbar\'></div>')
        $('#loadingbar').addClass('waiting').append($('<dt/><dd/>'))
        $('#loadingbar').width((50 + Math.random() * 30) + '%')
      }
      if (typeof async === 'undefined') {
        async = true
      }
      if (!method) {
        method = 'POST'
      }
      method = method.toUpperCase()
      if (method !== 'POST') {
        hash = url
        hash = hash.replace(location.protocol, '')
        hash = hash.replace('//' + location.hostname, '')
        hash = hash.split('?')[0]
        window.location.hash = hash
        window.hashUrlStack['' + hash] = {
          url: url,
          method: method,
          params: params,
          cb: cb
        }
      }
      z = Math.floor(Math.random() * 123456789)
      params = params + ('&__z=' + z)
      console.log('Loading ' + url + ' with params:' + params + ', method ' + method + ' and async:' + async + '...')
      ret = $.ajax(url, {
        type: method,
        data: params,
        async: async,
        cache: false,
        success: function (data, textStatus, xhr) {
          var title
          $('#loadingbar').width('101%').delay(200).fadeOut(400, function () {
            return $(this).remove()
          })
          window.wasRequested = false

          /*if xhr.getResponseHeader 'REQUIRES_AUTH' == '1'
              XMLHttpRequest.abort()
              window.location = location
              return false
           */
          if ($(document).find('#admin-nav').find('a.active').length > 0) {
            title = $(document).find('#admin-nav').find('a.active').text()
            document.title = title
          }
          if (cb) {
            data = Url.decorate(data, cb)
          }
          if (!async) {
            return data
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          var data
          window.wasRequested = false
          console.log('early error', jqXHR.responseText)
          console.log('error: ', textStatus, errorThrown)
          if (cb) {
            data = Url.decorate({
              status: 'error',
              reply: errorThrown
            }, cb)
          }
          if (!async) {
            return data
          }
        },
        complete: function (xhr) {
          window.wasRequested = false
          if (xhr.status === 302) {
            return location.href = xhr.getResponseHeader('Location')
          }

          /*if xhr.getResponseHeader 'REQUIRES_AUTH' == '1'
              XMLHttpRequest.abort();
              window.location = location
              return false
           */
        }
      })
      if (!async) {
        return ret
      }
    }

    Url.decorate = function (data, objArr) {
      var func, i, len
      if (typeof objArr !== 'object') {
        objArr = [objArr]
      }
      for (i = 0, len = objArr.length; i < len; i++) {
        func = objArr[i]
        if (func && typeof func === 'function') {
          data = Url.callback(func, data)
        }
      }
      return data
    }

    Url.callback = function () {
      var args, cb, ret
      args = Array.prototype.slice.call(arguments)
      cb = args.shift()
      args.concat(Array.prototype.slice.call(arguments))
      if (typeof cb === 'string' && typeof window[cb] !== 'undefined') {
        ret = window[cb].apply(null, args)
      } else {
        ret = cb.apply(null, args)
      }
      return ret
    }

    Url.page = function (url, params, method, callback) {
      var cb
      if (method == null) {
        method = 'GET'
      }
      window.wasRequested = true
      cb = function (data, callback) {
        var title
        $('#body-contents').off()
        if (typeof data === 'object') {
          if (data.status === 'error') {
            Message.show(data.reply, true)
          } else {
            Message.show(data.reply)
          }
        } else {
          $('#body-contents').html(data)
          title = $(document).find('#admin-nav').find('a.active').text()
          document.title = title
        }
        if (callback) {
          return Url.callback(callback, data)
        }
      }
      return load(url, params, cb, method)
    }

    Url.post = function (url, params, callback) {
      window.wasRequested = true
      return load(url, params, callback, 'POST')
    }

    Url.get = function (url, params, callback) {
      window.wasRequested = true
      return load(url, params, callback, 'GET')
    }

    Url.spost = function (url, params, callback) {
      window.wasRequested = true
      return load(url, params, callback, 'POST', false)
    }

    Url.sget = function (url, params, callback) {
      window.wasRequested = true
      return load(url, params, callback, 'GET', false)
    }

    Url.getHash = function () {
      return window.location.hash.slice(1)
    }

    Url.removeHash = function () {
      return history.pushState('', document.title, window.location.pathname + window.location.search)
    }

    Url.getParam = function (name) {
      var regex, results
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
      regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
      results = regex.exec(location.search)
      if (results === null) {
        return ''
      }
      return decodeURIComponent(results[1].replace(/\+/g, ' '))
    }

    Url.getBase = function () {
      return window.location.protocol + '//' + window.location.host + window.location.pathname
    }

    Url.serialize = function (obj, prefix) {
      var k, p, str, v
      str = []
      for (p in obj) {
        if (obj.hasOwnProperty(p)) {
          k = prefix ? prefix + '[' + p + ']' : p
          v = obj[p]
          str.push(typeof v === 'object' ? Url.serialize(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v))
        }
      }
      return str.join('&')
    }

    return Url

  })()

}).call(this)

//# sourceMappingURL=Url.js.map
