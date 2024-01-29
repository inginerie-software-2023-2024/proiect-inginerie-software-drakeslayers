from flask import Flask

def create_app():
    app = Flask(__name__)
    
    # import routes
    with app.app_context():
        from . import routes

    return app