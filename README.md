# K8sNetPolicy

A Kubernetes application demonstrating network policies and persistent storage configuration with a three-tier architecture (Frontend, Backend, MySQL).

## Network Policies

The application implements strict network isolation using Kubernetes Network Policies:

### Frontend Network Policy
- **Ingress**: Accepts traffic on port 80
- **Egress**: Only allows traffic to backend service on port 3000

### Backend Network Policy
- **Ingress**: Only accepts traffic from frontend pods on port 3000
- **Egress**: Only allows traffic to MySQL pods on port 3306

### MySQL Network Policy
- **Ingress**: Only accepts traffic from backend pods on port 3306
- **Egress**: No outbound connections allowed