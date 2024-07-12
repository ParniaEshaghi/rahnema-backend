import re
import time
import random
from collections import OrderedDict

class KeyValueDatabase:
    def __init__(self):
        self.databases = {}
        self.current_database = 'default'
        self.create_database('default')
    
    def create_database(self, name, max_size=10, eviction_policy='random'):
        self.databases[name] = {
            'data': OrderedDict(),
            'max_size': max_size,
            'eviction_policy': eviction_policy,
            'access_order': OrderedDict()  # For LRU eviction policy
        }
    
    def switch_database(self, name, max_size=10, eviction_policy='random'):
        if name not in self.databases:
            self.create_database(name, max_size, eviction_policy)
        self.current_database = name
    
    def set_key(self, key, value, ttl=None):
        db = self.databases[self.current_database]
        if len(db['data']) >= db['max_size']:
            self.evict_key()
        expire_time = time.time() + ttl if ttl else None
        db['data'][key] = {'value': value, 'expire_time': expire_time}
        db['access_order'][key] = time.time()
        print("ok")
    
    def get_key(self, key):
        db = self.databases[self.current_database]
        if key in db['data']:
            entry = db['data'][key]
            if entry['expire_time'] and entry['expire_time'] < time.time():
                del db['data'][key]
                del db['access_order'][key]
                print("null")
            else:
                db['access_order'][key] = time.time()
                print(entry['value'])
        else:
            print("null")
    
    def del_key(self, key):
        db = self.databases[self.current_database]
        if key in db['data']:
            del db['data'][key]
            del db['access_order'][key]
            print("true")
        else:
            print("false")
    
    def search_keys(self, pattern, limit=10, page=1):
        db = self.databases[self.current_database]
        regex = re.compile(pattern)
        matched_keys = [key for key in db['data'].keys() if regex.match(key)]
        start = (page - 1) * limit
        end = start + limit
        print(matched_keys[start:end])
    
    def list_databases(self):
        print(list(self.databases.keys()))
    
    def evict_key(self):
        db = self.databases[self.current_database]
        if db['eviction_policy'] == 'random':
            key_to_remove = random.choice(list(db['data'].keys()))
        elif db['eviction_policy'] == 'lru':
            key_to_remove = next(iter(db['access_order']))
        elif db['eviction_policy'] == 'noeviction':
            raise Exception("Database is full, cannot add new key.")
        del db['data'][key_to_remove]
        del db['access_order'][key_to_remove]

if __name__ == "__main__":
    db = KeyValueDatabase()
    while True:
        command = input().strip().split()
        if not command:
            continue
        action = command[0].lower()
        if action == 'set':
            key = command[1]
            value = command[2]
            ttl = int(command[3]) if len(command) > 3 else None
            db.set_key(key, value, ttl)
        elif action == 'get':
            key = command[1]
            db.get_key(key)
        elif action == 'del':
            key = command[1]
            db.del_key(key)
        elif action == 'keys':
            pattern = command[1]
            limit = int(command[3]) if len(command) > 3 else 10
            page = int(command[5]) if len(command) > 5 else 1
            db.search_keys(pattern, limit, page)
        elif action == 'use':
            name = command[1]
            max_size = int(command[2]) if len(command) > 2 else 10
            eviction_policy = command[3] if len(command) > 3 else 'random'
            db.switch_database(name, max_size, eviction_policy)
            print("db switched")
        elif action == 'list':
            db.list_databases()
        elif action == 'exit':
            break
        else:
            print("Unknown command")
