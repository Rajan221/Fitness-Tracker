from flask import Blueprint

# Create a Blueprint for the product controller
product_blueprint = Blueprint('product', __name__)

@product_blueprint.route("/product")
def product():
    return "product"
