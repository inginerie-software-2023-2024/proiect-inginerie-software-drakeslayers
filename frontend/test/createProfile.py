
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

email = "selenium27@selenium.com"
password = "1234"

def clickableWrapper(field):
    return WebDriverWait(driver, 5).until(EC.element_to_be_clickable(field))
def register():
    # Find the button with "Register" text and click it
    register_button = driver.find_element(By.CSS_SELECTOR, '[data-sel="registerNav"]')
    register_button.click()

    # Find and fill the Email field
    email_field = driver.find_element(By.CSS_SELECTOR, '[data-sel="email"]')
    email_field.send_keys(email)
    time.sleep(2)

    # Find and fill the Password field
    password_field = driver.find_element(By.CSS_SELECTOR, '[data-sel="password"]')
    password_field.send_keys(password)
    time.sleep(2)

    # Find and fill the Confirm Password field
    confirm_password_field = driver.find_element(By.CSS_SELECTOR, '[data-sel="confirmPassword"]')
    confirm_password_field.send_keys(password)  # Find the button with "Register" text and click it
    time.sleep(2)

    register_submit_button = driver.find_element(By.CSS_SELECTOR, '[data-sel="registerUser"]')
    register_submit_button.click()


def createProfile():

    username = "selenium"
    name = "selenium"
    bio = "bio description"
    picturePath = os.path.abspath("./Beluga.png")
    privacy = 'True'

    def nextButton(idx):
        next_field = driver.find_element(By.CSS_SELECTOR, f'[data-sel="nextButton{idx}"]')
        next_field = clickableWrapper(next_field)
        next_field.location_once_scrolled_into_view
        next_field.click()

    username_field = driver.find_element(By.CSS_SELECTOR, '[data-sel="username"]')
    username_field.send_keys(username)
    time.sleep(2)

    nextButton(1)

    name_field = driver.find_element(By.CSS_SELECTOR, '[data-sel="name"]')
    name_field.send_keys(name)
    time.sleep(2)

    nextButton(2)

    bio_field = driver.find_element(By.CSS_SELECTOR, '[data-sel="bio"]')
    bio_field.send_keys(bio)
    time.sleep(2)

    nextButton(3)

    file_input = driver.find_element(By.CSS_SELECTOR, "[data-sel='profilePicture']")
    file_input.send_keys(picturePath)
    time.sleep(2)

    nextButton(4)

    privacy_dropdown = driver.find_element(By.CSS_SELECTOR, '[data-sel="privacy"]')
    privacy_dropdown = clickableWrapper(privacy_dropdown)
    privacy_dropdown.click()
    time.sleep(2)

    privacy_select = driver.find_element(By.CSS_SELECTOR, f'[data-sel="privacy{privacy}"]')
    privacy_select = clickableWrapper(privacy_select)
    privacy_select.click()
    time.sleep(2)

    nextButton(5)

    submit_button = driver.find_element(By.CSS_SELECTOR, '[data-sel="submitButton"]')
    submit_button = clickableWrapper(submit_button)
    submit_button.click()

try:
   time.sleep(2)
   register()
   time.sleep(2)
   createProfile()
finally:
    driver.quit()