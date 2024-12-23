# This file is executed on every boot (including wake-boot from deepsleep)
# It is executed after boot.py, before main.py
import os, machine
import network
import gc

gc.collect()

# Disable Access Point
ap_if = network.WLAN(network.AP_IF)
ap_if.active(False)

# Connect to the WIFI when booting
SSID = '<YOUR WIFI SSID>'               # Set the WIFI network SSID
PASSWORD = '<YOUR WIFI PASSWORD>'       # Set the WIFI network password
network.country('<YOUR COUNTRY CODE>')  # Set the country code for the WIFI (ISO 3166-1 Alpha-2 country code)
network.hostname('busylight-esp32')     # Hostname that will identify this device on the network

def boot_wifi_connect():
    wlan = network.WLAN(network.STA_IF)
    if not wlan.isconnected():
        print('connecting to network...')
        wlan.active(True)
        wlan.connect(SSID, PASSWORD)
        while not wlan.isconnected():
            pass
    ip, mask, gateway, dns = wlan.ifconfig()
    print('\nNetwork config:')
    print('- IP address: ' + ip)
    print('- Network mask: ' + mask)
    print('- Network gateway: ' + gateway)
    print('- DNS server: ' + dns + '\n')

boot_wifi_connect()