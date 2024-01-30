
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import os
import time

service = Service(executable_path='g:\Downloads_G\geckodriver.exe')
options = webdriver.FirefoxOptions()
driver = webdriver.Firefox(service=service, options=options)

driver.get("https://localhost:4200")

email = "selenium26@selenium.com"
password = "1234"

def clickableWrapper(field):
    return WebDriverWait(driver, 5).until(EC.element_to_be_clickable(field))

def login():
    login_nav = clickableWrapper(driver.find_element(By.CSS_SELECTOR, '[data-sel="loginNav"]'))
    login_nav.click()

    # Find and fill the Email field
    email_field = driver.find_element(By.CSS_SELECTOR, '[data-sel="email"]')
    email_field.send_keys(email)
    time.sleep(2)

    # Find and fill the Password field
    password_field = driver.find_element(By.CSS_SELECTOR, '[data-sel="password"]')
    password_field.send_keys(password)
    time.sleep(2)

    login_submit_button = clickableWrapper(driver.find_element(By.CSS_SELECTOR, '[data-sel="submitButton"]'))
    login_submit_button.click()

    # time.sleep(2)


def createPost():

    description = "My cool description"
    picturePath1 = os.path.abspath("./Beluga.png")
    picturePath2 = os.path.abspath("./Hecker.png")

    createPost_nav = clickableWrapper(driver.find_element(By.CSS_SELECTOR, '[data-sel="createPostNav"]'))
    createPost_nav.click()

    time.sleep(2)

    description_field = driver.find_element(By.CSS_SELECTOR, '[data-sel="description"]')
    description_field.send_keys(description)

    fileUpload_element = clickableWrapper(driver.find_element(By.CSS_SELECTOR, '[data-sel="fileUpload"]'))

    # Find the input field nested inside the parent element
    picture_field = fileUpload_element.find_element(By.CLASS_NAME, 'file-input')

    # Perform actions on the input field, for example, send_keys to upload a file
    picture_field.send_keys(picturePath1)
    picture_field.send_keys(picturePath2)

    time.sleep(2)

    login_submit_button = clickableWrapper(driver.find_element(By.CSS_SELECTOR, '[data-sel="submitButton"]'))
    login_submit_button.click()

    time.sleep(2)

try:
   time.sleep(2)
   login()
   time.sleep(2)
   createPost()
finally:
    driver.quit()