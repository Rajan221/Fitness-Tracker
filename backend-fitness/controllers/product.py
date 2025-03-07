from flask import Blueprint


product_blueprint = Blueprint('product', __name__)

@product_blueprint.route("/product")
def product():
    return "product"
