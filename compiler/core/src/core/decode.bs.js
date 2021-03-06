// Generated by BUCKLESCRIPT VERSION 2.1.0, PLEASE EDIT WITH CARE
'use strict';

var Block                      = require("bs-platform/lib/js/block.js");
var Curry                      = require("bs-platform/lib/js/curry.js");
var Js_json                    = require("bs-platform/lib/js/js_json.js");
var Js_option                  = require("bs-platform/lib/js/js_option.js");
var Json_decode                = require("bs-json/src/Json_decode.js");
var Types$LonaCompilerCore     = require("./types.bs.js");
var Caml_builtin_exceptions    = require("bs-platform/lib/js/caml_builtin_exceptions.js");
var StringMap$LonaCompilerCore = require("../containers/stringMap.bs.js");

var parameterTypeMap = StringMap$LonaCompilerCore.fromList(/* :: */[
      /* tuple */[
        "text",
        /* Reference */Block.__(0, ["String"])
      ],
      /* :: */[
        /* tuple */[
          "visible",
          /* Reference */Block.__(0, ["Boolean"])
        ],
        /* :: */[
          /* tuple */[
            "numberOfLines",
            /* Reference */Block.__(0, ["Number"])
          ],
          /* :: */[
            /* tuple */[
              "backgroundColor",
              Types$LonaCompilerCore.colorType
            ],
            /* :: */[
              /* tuple */[
                "image",
                Types$LonaCompilerCore.urlType
              ],
              /* :: */[
                /* tuple */[
                  "alignItems",
                  /* Reference */Block.__(0, ["String"])
                ],
                /* :: */[
                  /* tuple */[
                    "alignSelf",
                    /* Reference */Block.__(0, ["String"])
                  ],
                  /* :: */[
                    /* tuple */[
                      "flex",
                      /* Reference */Block.__(0, ["Number"])
                    ],
                    /* :: */[
                      /* tuple */[
                        "flexDirection",
                        /* Reference */Block.__(0, ["String"])
                      ],
                      /* :: */[
                        /* tuple */[
                          "font",
                          /* Reference */Block.__(0, ["String"])
                        ],
                        /* :: */[
                          /* tuple */[
                            "justifyContent",
                            /* Reference */Block.__(0, ["String"])
                          ],
                          /* :: */[
                            /* tuple */[
                              "marginTop",
                              /* Reference */Block.__(0, ["Number"])
                            ],
                            /* :: */[
                              /* tuple */[
                                "marginRight",
                                /* Reference */Block.__(0, ["Number"])
                              ],
                              /* :: */[
                                /* tuple */[
                                  "marginBottom",
                                  /* Reference */Block.__(0, ["Number"])
                                ],
                                /* :: */[
                                  /* tuple */[
                                    "marginLeft",
                                    /* Reference */Block.__(0, ["Number"])
                                  ],
                                  /* :: */[
                                    /* tuple */[
                                      "paddingTop",
                                      /* Reference */Block.__(0, ["Number"])
                                    ],
                                    /* :: */[
                                      /* tuple */[
                                        "paddingRight",
                                        /* Reference */Block.__(0, ["Number"])
                                      ],
                                      /* :: */[
                                        /* tuple */[
                                          "paddingBottom",
                                          /* Reference */Block.__(0, ["Number"])
                                        ],
                                        /* :: */[
                                          /* tuple */[
                                            "paddingLeft",
                                            /* Reference */Block.__(0, ["Number"])
                                          ],
                                          /* :: */[
                                            /* tuple */[
                                              "borderRadius",
                                              /* Reference */Block.__(0, ["Number"])
                                            ],
                                            /* :: */[
                                              /* tuple */[
                                                "width",
                                                /* Reference */Block.__(0, ["Number"])
                                              ],
                                              /* :: */[
                                                /* tuple */[
                                                  "height",
                                                  /* Reference */Block.__(0, ["Number"])
                                                ],
                                                /* [] */0
                                              ]
                                            ]
                                          ]
                                        ]
                                      ]
                                    ]
                                  ]
                                ]
                              ]
                            ]
                          ]
                        ]
                      ]
                    ]
                  ]
                ]
              ]
            ]
          ]
        ]
      ]
    ]);

function parameterType(name) {
  try {
    return Curry._2(StringMap$LonaCompilerCore.find, name, parameterTypeMap);
  }
  catch (exn){
    if (exn === Caml_builtin_exceptions.not_found) {
      console.log("Unknown built-in parameter when deserializing:", name);
      return /* Reference */Block.__(0, ["BuiltIn-Null"]);
    } else {
      throw exn;
    }
  }
}

function lonaType(json) {
  var referenceType = function (json) {
    return /* Reference */Block.__(0, [Json_decode.string(json)]);
  };
  var namedType = function (json) {
    var named = Json_decode.field("alias", Json_decode.string, json);
    var ltype = Json_decode.field("of", Json_decode.string, json);
    return /* Named */Block.__(1, [
              named,
              /* Reference */Block.__(0, [ltype])
            ]);
  };
  return Json_decode.either(referenceType, namedType)(json);
}

var Types = /* module */[/* lonaType */lonaType];

function parameter(json) {
  return /* record */[
          /* name */Json_decode.field("name", Json_decode.string, json),
          /* ltype */Json_decode.field("type", lonaType, json),
          /* defaultValue */Json_decode.optional((function (param) {
                  return Json_decode.field("defaultValue", (function (x) {
                                return x;
                              }), param);
                }), json)
        ];
}

var Parameters = /* module */[/* parameter */parameter];

function layerType(json) {
  var match = Json_decode.string(json);
  switch (match) {
    case "Animation" : 
        return /* Animation */3;
    case "Children" : 
        return /* Children */4;
    case "Component" : 
        return /* Component */5;
    case "Image" : 
        return /* Image */2;
    case "Text" : 
        return /* Text */1;
    case "View" : 
        return /* View */0;
    default:
      return /* Unknown */6;
  }
}

function layer(json) {
  var parameterDictionary = function (json) {
    return Curry._2(StringMap$LonaCompilerCore.mapi, (function (key, value) {
                  return /* record */[
                          /* ltype */parameterType(key),
                          /* data */value
                        ];
                }), StringMap$LonaCompilerCore.fromJsDict(Js_option.getExn(Js_json.decodeObject(json))));
  };
  return /* record */[
          /* typeName */Json_decode.field("type", layerType, json),
          /* name */Json_decode.field("name", Json_decode.string, json),
          /* parameters */Json_decode.field("parameters", parameterDictionary, json),
          /* children */Json_decode.field("children", (function (param) {
                  return Json_decode.list(layer, param);
                }), json)
        ];
}

var Layer = /* module */[
  /* layerType */layerType,
  /* layer */layer
];

function logicNode(json) {
  var cmp = function (json) {
    var match = Json_decode.string(json);
    switch (match) {
      case "equal to" : 
          return /* Eq */0;
      case "greater than" : 
          return /* Gt */2;
      case "greater than or equal to" : 
          return /* Gte */3;
      case "less than" : 
          return /* Lt */4;
      case "less than or equal to" : 
          return /* Lte */5;
      case "not equal to" : 
          return /* Neq */1;
      default:
        return /* Unknown */6;
    }
  };
  var value = function (json) {
    var identifier = function (json) {
      var ltype = Json_decode.field("type", lonaType, json);
      var path = Json_decode.field("path", (function (param) {
              return Json_decode.list(Json_decode.string, param);
            }), json);
      return /* Identifier */Block.__(0, [
                ltype,
                path
              ]);
    };
    var literal = function (json) {
      var ltype = Json_decode.field("type", lonaType, json);
      var data = Json_decode.field("data", (function (x) {
              return x;
            }), json);
      return /* Literal */Block.__(1, [/* record */[
                  /* ltype */ltype,
                  /* data */data
                ]]);
    };
    var match = Json_decode.field("type", Json_decode.string, json);
    switch (match) {
      case "identifier" : 
          return Json_decode.field("value", identifier, json);
      case "value" : 
          return Json_decode.field("value", literal, json);
      default:
        return /* None */0;
    }
  };
  var nodes = Curry._1(Json_decode.at(/* :: */[
            "nodes",
            /* [] */0
          ], (function (param) {
              return Json_decode.list(logicNode, param);
            })), json);
  var arg = function (path, decoder) {
    return Curry._1(Json_decode.at(/* :: */[
                    "function",
                    /* :: */[
                      "arguments",
                      path
                    ]
                  ], decoder), json);
  };
  var match = Curry._1(Json_decode.at(/* :: */[
            "function",
            /* :: */[
              "name",
              /* [] */0
            ]
          ], Json_decode.string), json);
  switch (match) {
    case "add(lhs, to rhs, and assign to value)" : 
        return /* Add */Block.__(3, [
                  arg(/* :: */[
                        "lhs",
                        /* [] */0
                      ], value),
                  arg(/* :: */[
                        "rhs",
                        /* [] */0
                      ], value),
                  arg(/* :: */[
                        "value",
                        /* [] */0
                      ], value)
                ]);
    case "assign(lhs, to rhs)" : 
        return /* Assign */Block.__(2, [
                  arg(/* :: */[
                        "lhs",
                        /* [] */0
                      ], value),
                  arg(/* :: */[
                        "rhs",
                        /* [] */0
                      ], value)
                ]);
    case "if(lhs, is cmp, rhs)" : 
        return /* If */Block.__(0, [
                  arg(/* :: */[
                        "lhs",
                        /* [] */0
                      ], value),
                  arg(/* :: */[
                        "cmp",
                        /* :: */[
                          "value",
                          /* :: */[
                            "data",
                            /* [] */0
                          ]
                        ]
                      ], cmp),
                  arg(/* :: */[
                        "rhs",
                        /* [] */0
                      ], value),
                  /* Block */Block.__(5, [nodes])
                ]);
    case "if(value)" : 
        return /* IfExists */Block.__(1, [
                  arg(/* :: */[
                        "value",
                        /* [] */0
                      ], value),
                  /* Block */Block.__(5, [nodes])
                ]);
    default:
      return /* None */0;
  }
}

function parameters(json) {
  return Json_decode.field("parameters", (function (param) {
                return Json_decode.list(parameter, param);
              }), json);
}

function rootLayer(json) {
  return Json_decode.field("rootLayer", layer, json);
}

function logic(json) {
  return /* Block */Block.__(5, [Json_decode.field("logic", (function (param) {
                    return Json_decode.list(logicNode, param);
                  }), json)]);
}

var Component = /* module */[
  /* parameters */parameters,
  /* rootLayer */rootLayer,
  /* logic */logic
];

var colorType = Types$LonaCompilerCore.colorType;

var urlType = Types$LonaCompilerCore.urlType;

exports.colorType        = colorType;
exports.urlType          = urlType;
exports.parameterTypeMap = parameterTypeMap;
exports.parameterType    = parameterType;
exports.Types            = Types;
exports.Parameters       = Parameters;
exports.Layer            = Layer;
exports.logicNode        = logicNode;
exports.Component        = Component;
/* parameterTypeMap Not a pure module */
