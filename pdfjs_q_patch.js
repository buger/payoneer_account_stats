// Small monkey-path that replace PDFJS.Promise by Q libary
// https://github.com/kriskowal/q
// 
// Its done because PDFJS.Promise didn't support chaining

Q._defer = Q.defer
Q.defer = function(){
  obj = Q._defer.apply(this, arguments)
  obj.then = obj.promise.then.bind(obj.promise)
  return obj
}

PDFJS.Promise = Q.defer