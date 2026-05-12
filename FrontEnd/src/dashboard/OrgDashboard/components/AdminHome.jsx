import React from "react";

export default function AdminHome() {
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>📦</div>
          <div>
            <h1 style={styles.mainTitle}>Vishnu's Store</h1>
            <p style={styles.subtitle}>Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div style={styles.welcomeCard}>
        <h2 style={styles.welcomeTitle}>Welcome to Your Admin Panel! 👋</h2>
        <p style={styles.welcomeText}>
          Manage your e-commerce platform with ease. Access powerful tools to control products, orders, customers, and business insights all in one place.
        </p>
        <div style={styles.featureGrid}>
          <div style={styles.featureBadge}>
            <span style={styles.badgeIcon}>⚡</span>
            <span style={styles.badgeText}>Fast & Efficient</span>
          </div>
          <div style={styles.featureBadge}>
            <span style={styles.badgeIcon}>🔒</span>
            <span style={styles.badgeText}>Secure Platform</span>
          </div>
        </div>
      </div>

      {/* Main Feature Cards */}
      <div style={styles.cardsContainer}>
        <div 
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.borderColor = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = '#334155';
          }}
        >
          <div style={{...styles.iconBox, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'}}>
            <span style={styles.cardIcon}>🛒</span>
          </div>
          <h3 style={styles.cardTitle}>Order Management</h3>
          <p style={styles.cardDescription}>
            View and manage all customer orders. Track order status, process shipments, and handle returns efficiently.
          </p>
          <div style={styles.tagContainer}>
            <span style={{...styles.tag, background: '#3b82f6'}}>Orders</span>
            <span style={{...styles.tag, background: '#3b82f6'}}>Shipping</span>
          </div>
        </div>

        <div 
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.borderColor = '#10b981';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = '#334155';
          }}
        >
          <div style={{...styles.iconBox, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>
            <span style={styles.cardIcon}>👗</span>
          </div>
          <h3 style={styles.cardTitle}>Product Catalog</h3>
          <p style={styles.cardDescription}>
            Add, edit, and organize your product inventory. Manage categories, pricing, images, and product descriptions.
          </p>
          <div style={styles.tagContainer}>
            <span style={{...styles.tag, background: '#10b981'}}>Inventory</span>
            <span style={{...styles.tag, background: '#10b981'}}>Catalog</span>
          </div>
        </div>

        <div 
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.borderColor = '#a855f7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = '#334155';
          }}
        >
          <div style={{...styles.iconBox, background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)'}}>
            <span style={styles.cardIcon}>👥</span>
          </div>
          <h3 style={styles.cardTitle}>Customer Management</h3>
          <p style={styles.cardDescription}>
            Access customer profiles, view purchase history, manage accounts, and provide excellent customer service.
          </p>
          <div style={styles.tagContainer}>
            <span style={{...styles.tag, background: '#a855f7'}}>Customers</span>
            <span style={{...styles.tag, background: '#a855f7'}}>Support</span>
          </div>
        </div>

        <div 
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.borderColor = '#f59e0b';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = '#334155';
          }}
        >
          <div style={{...styles.iconBox, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>
            <span style={styles.cardIcon}>📊</span>
          </div>
          <h3 style={styles.cardTitle}>Analytics & Reports</h3>
          <p style={styles.cardDescription}>
            Monitor business performance with detailed analytics. Generate reports and gain insights for growth.
          </p>
          <div style={styles.tagContainer}>
            <span style={{...styles.tag, background: '#f59e0b'}}>Reports</span>
            <span style={{...styles.tag, background: '#f59e0b'}}>Analytics</span>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div style={styles.infoSection}>
        <div style={styles.infoCard}>
          <span style={styles.infoIcon}>💼</span>
          <div>
            <h4 style={styles.infoTitle}>Business Operations</h4>
            <p style={styles.infoText}>Control all aspects of your e-commerce business from inventory to sales</p>
          </div>
        </div>
        <div style={styles.infoCard}>
          <span style={styles.infoIcon}>🔍</span>
          <div>
            <h4 style={styles.infoTitle}>Search & Filter</h4>
            <p style={styles.infoText}>Quickly find products, orders, and customers with advanced search tools</p>
          </div>
        </div>
        <div style={styles.infoCard}>
          <span style={styles.infoIcon}>⚙️</span>
          <div>
            <h4 style={styles.infoTitle}>Settings & Config</h4>
            <p style={styles.infoText}>Customize your platform settings, payment options, and shipping methods</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.statusIndicator}>
            <div style={styles.statusDot}></div>
            <div>
              <p style={styles.statusText}>Platform Status: Online & Ready</p>
              <p style={styles.statusSubtext}>All systems operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
    padding: '40px 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    marginBottom: '40px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  logo: {
    width: '60px',
    height: '60px',
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '30px',
    boxShadow: '0 10px 30px rgba(168, 85, 247, 0.3)',
  },
  mainTitle: {
    fontSize: '42px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0',
  },
  subtitle: {
    fontSize: '18px',
    color: '#c084fc',
    margin: '5px 0 0 0',
  },
  welcomeCard: {
    background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
    borderRadius: '20px',
    padding: '50px',
    marginBottom: '50px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
  },
  welcomeTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '20px',
    marginTop: '0',
  },
  welcomeText: {
    fontSize: '18px',
    color: '#fae8ff',
    lineHeight: '1.7',
    marginBottom: '30px',
    maxWidth: '800px',
  },
  featureGrid: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  featureBadge: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    padding: '15px 25px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  badgeIcon: {
    fontSize: '24px',
  },
  badgeText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '16px',
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
    marginBottom: '50px',
  },
  card: {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '2px solid #334155',
    borderRadius: '20px',
    padding: '30px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  },
  iconBox: {
    width: '70px',
    height: '70px',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
  },
  cardIcon: {
    fontSize: '36px',
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '15px',
    marginTop: '0',
  },
  cardDescription: {
    fontSize: '15px',
    color: '#94a3b8',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  tagContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  tag: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#ffffff',
  },
  infoSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px',
    marginBottom: '40px',
  },
  infoCard: {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid #334155',
    borderRadius: '15px',
    padding: '25px',
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: '36px',
  },
  infoTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
    margin: '0 0 8px 0',
  },
  infoText: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: '0',
    lineHeight: '1.5',
  },
  footer: {
    background: 'rgba(30, 41, 59, 0.4)',
    backdropFilter: 'blur(10px)',
    border: '1px solid #334155',
    borderRadius: '15px',
    padding: '25px',
  },
  footerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  statusDot: {
    width: '12px',
    height: '12px',
    background: '#10b981',
    borderRadius: '50%',
    boxShadow: '0 0 20px #10b981',
    animation: 'pulse 2s infinite',
  },
  statusText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    margin: '0',
  },
  statusSubtext: {
    fontSize: '13px',
    color: '#94a3b8',
    margin: '4px 0 0 0',
  },
};