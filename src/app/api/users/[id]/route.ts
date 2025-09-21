import { NextRequest, NextResponse } from 'next/server';
import { getUserByRequest } from '@/lib/database/utils';
import { users } from '@/lib/database/users';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación y permisos de admin
    const user = await getUserByRequest(request);
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 } 
      );
    }

    if (!user.is_admin) {
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin privileges required.' },
        { status: 403 } 
      );
    }

    const { id } = await context.params;
    const userId = parseInt(id);
    const body = await request.json();
    const { action } = body;

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Manejar diferentes acciones
    if (action === 'deactivate') {
      // No permitir que un admin se desactive a sí mismo
      if (userId === user.id) {
        return NextResponse.json(
          { success: false, error: 'Cannot deactivate yourself' },
          { status: 400 }
        );
      }

      const updatedUser = await users.deactivateUser(userId);
      
      if (!updatedUser) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: updatedUser
      });
    }

    if (action === 'activate') {
      const updatedUser = await users.updateUser(userId, { active: true });
      
      if (!updatedUser) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: updatedUser,
        message: 'User activated successfully'
      });
    }

    if (action === 'toggle_admin') {
      // No permitir que un admin se quite permisos a sí mismo
      if (userId === user.id) {
        return NextResponse.json(
          { success: false, error: 'Cannot modify your own admin status' },
          { status: 400 }
        );
      }

      const targetUser = await users.getUsersById(userId);
      if (!targetUser) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      // Alternar estado de admin
      const newAdminStatus = !targetUser.is_admin;
      const updatedUser = await users.updateUser(userId, { is_admin: newAdminStatus });
      
      if (!updatedUser) {
        return NextResponse.json(
          { success: false, error: 'Failed to update user' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: updatedUser,
        message: newAdminStatus ? 'User promoted to admin' : 'Admin privileges revoked'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error updating user:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = errorMessage.includes('reserved products') ? 400 : 500;
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage
      },
      { status: statusCode }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación y permisos de admin
    const user = await getUserByRequest(request);
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 } 
      );
    }

    if (!user.is_admin) {
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin privileges required.' },
        { status: 403 } 
      );
    }

    const { id } = await context.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // No permitir que un admin se elimine a sí mismo
    if (userId === user.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete yourself' },
        { status: 400 }
      );
    }

    const success = await users.deleteUser(userId);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = errorMessage.includes('reserved products') ? 400 : 500;
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage
      },
      { status: statusCode }
    );
  }
}