/**
 * Created by qiucheng on 15/4/19.
 */
/**
 * Usage
 * <div style="position:relative">
 *     I am hahaha
 *     <delete-mark/>
 * </div>
 *
 * the close button appearing on the top right corner of a div,
 * remember to set the "position" attribute to "relative" on the
 * parent div
 * @type {*[]}
 */
module.exports = [
  function(){
      return {
          restrict:"E",
          replace:true,
          template:'<div class="delete-mark"></div>'
      }
  }
];