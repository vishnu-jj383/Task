from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from rest_framework import status

class TaskAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.login(username='testuser', password='testpass')
        self.token = self.client.post('/api/login/', {'username': 'testuser', 'password': 'testpass'}).data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_register(self):
        response = self.client.post('/api/register/', {'username': 'newuser', 'password': 'newpass'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_task(self):
        response = self.client.post('/api/tasks/', {'title': 'Test Task', 'priority': 'high'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_tasks(self):
        self.client.post('/api/tasks/', {'title': 'Test Task', 'priority': 'high'})
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)