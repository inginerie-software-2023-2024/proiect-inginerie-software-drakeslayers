
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

    time.sleep(2)

def logout():
    logout_nav = clickableWrapper(driver.find_element(By.CSS_SELECTOR, '[data-sel="logoutNav"]'))
    logout_nav.click()

    time.sleep(2)

try:
   time.sleep(2)
   login()
   logout()
finally:
    driver.quit()