module Ast = SwiftAst;

module Format = SwiftFormat;

module Document = SwiftDocument;

let rec toSwiftAST = (colors, rootLayer: Types.layer, logicRootNode) => {
  let identifierName = (node) =>
    switch node {
    | Logic.Identifier(ltype, [head, ...tail]) =>
      switch head {
      | "parameters" => Ast.SwiftIdentifier(List.hd(tail))
      | "layers" =>
        switch tail {
        | [second, ...tail] when second == rootLayer.name =>
          Ast.SwiftIdentifier(
            List.tl(tail)
            |> List.fold_left((a, b) => a ++ "." ++ Format.camelCase(b), List.hd(tail))
          )
        | [second, ...tail] =>
          Ast.SwiftIdentifier(
            tail
            |> List.fold_left((a, b) => a ++ "." ++ Format.camelCase(b), Format.layerName(second))
          )
        | _ => SwiftIdentifier("BadIdentifier")
        }
      | _ => SwiftIdentifier("BadIdentifier")
      }
    | _ => SwiftIdentifier("BadIdentifier")
    };
  let logicValueToSwiftAST = (x) =>
    switch x {
    | Logic.Identifier(_) => identifierName(x)
    | Literal(value) => Document.lonaValue(colors, value)
    | None => Empty
    };
  let typeAnnotationDoc =
    fun
    | Types.Reference(typeName) =>
      switch typeName {
      | "Boolean" => Ast.TypeName("Bool")
      | _ => TypeName(typeName)
      }
    | Named(name, _) => TypeName(name);
  let fromCmp = (x) =>
    switch x {
    | Types.Eq => "=="
    | Neq => "!="
    | Gt => ">"
    | Gte => ">="
    | Lt => "<"
    | Lte => "<="
    | Unknown => "???"
    };
  let unwrapBlock =
    fun
    | Logic.Block(body) => body
    | node => [node];
  let rec inner = (logicRootNode) =>
    switch logicRootNode {
    | Logic.Assign(a, b) =>
      let (left, right) =
        switch (logicValueToSwiftAST(b), logicValueToSwiftAST(a)) {
        | (Ast.SwiftIdentifier(name), LiteralExpression(Boolean(value)))
            when name |> Js.String.endsWith("visible") => (
            Ast.SwiftIdentifier(name |> Js.String.replace("visible", "isHidden")),
            Ast.LiteralExpression(Boolean(! value))
          )
        | (Ast.SwiftIdentifier(name), right) when name |> Js.String.endsWith("borderRadius") => (
            Ast.SwiftIdentifier(name |> Js.String.replace("borderRadius", "layer.cornerRadius")),
            right
          )
        | (Ast.SwiftIdentifier(name), right) when name |> Js.String.endsWith("height") => (
            Ast.SwiftIdentifier(
              name |> Js.String.replace(".height", "HeightAnchorConstraint?.constant")
            ),
            right
          )
        | (Ast.SwiftIdentifier(name), right) when name |> Js.String.endsWith("width") => (
            Ast.SwiftIdentifier(
              name |> Js.String.replace(".width", "WidthAnchorConstraint?.constant")
            ),
            right
          )
        | nodes => nodes
        };
      Ast.BinaryExpression({"left": left, "operator": "=", "right": right})
    | IfExists(a, body) =>
      /* TODO: Once we support optional params, compare to nil or extract via pattern */
      Ast.IfStatement({
        "condition": logicValueToSwiftAST(a),
        "block": unwrapBlock(body) |> List.map(inner)
      })
    | Block(body) => Ast.StatementListHelper(body |> List.map(inner))
    | If(a, cmp, b, body) =>
      Ast.IfStatement({
        "condition":
          Ast.BinaryExpression({
            "left": logicValueToSwiftAST(a),
            "operator": fromCmp(cmp),
            "right": logicValueToSwiftAST(b)
          }),
        "block": unwrapBlock(body) |> List.map(inner)
      })
    | Add(lhs, rhs, value) =>
      BinaryExpression({
        "left": logicValueToSwiftAST(value),
        "operator": "=",
        "right":
          Ast.BinaryExpression({
            "left": logicValueToSwiftAST(lhs),
            "operator": "+",
            "right": logicValueToSwiftAST(rhs)
          })
      })
    | Let(value) =>
      switch value {
      | Identifier(ltype, path) =>
        Ast.VariableDeclaration({
          "modifiers": [],
          "pattern":
            Ast.IdentifierPattern({
              "identifier": List.fold_left((a, b) => a ++ "." ++ b, List.hd(path), List.tl(path)),
              "annotation": Some(ltype |> typeAnnotationDoc)
            }),
          "init": (None: option(Ast.node)),
          "block": (None: option(Ast.initializerBlock))
        })
      | _ => Empty
      }
    | None => Empty
    };
  logicRootNode |> unwrapBlock |> List.map(inner)
};